import fetch from 'node-fetch'
import { Left } from '../../utils/either.js'

import { MongoBox } from '../../utils/mongo.js'
import { time } from '../../utils/time.js'

/**
 * @function fetchBarstoolData
 * @description fetch barstool data from the API
 *  @param {string} leagueId - the league id
 */
const fetchBarstoolData = (league) => {
  switch (league) {
    case 'nba':
      return fetch(
        'https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json'
      ).then((res) => res.json())

    case 'mlb':
      return fetch(
        'https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json'
      ).then((res) => res.json())

    default:
      return Left({ error: 'League not found' })
  }
}

/**
 *
 * @param {object} gameProps
 * @param {object} param1
 * @returns
 */
export const getGame = (gameProps, { req, mongo }) => {
  const queryProps = {
    mongo,
    league: req.params.league ?? gameProps.league,
    matchId: req.params.matchId ?? gameProps.matchId,
  }

  const getDocumentById = ({ mongo, league, matchId }) =>
    mongo.db.collection(league).findOne({ _id: matchId })

  const validateCache = async (promiseResult) => {
    const queryResult = await promiseResult
    const now = time.unix()

    // If no record is found, fetch from Barstool Sports and insert into the database
    if (!queryResult) {
      return fetchBarstoolData(queryProps.league).then((res) => ({
        updatedAt: now,
        data: res,
        newRecord: true,
      }))
    }

    // It's been less than 15 seconds since the record was last updated, so return the cached data
    const milisecondsDiff = now - queryResult.updatedAt
    const past15Seconds = milisecondsDiff >= 15000
    if (!past15Seconds) return queryResult

    // If the record is older than 15 seconds, fetch from Barstool Sports and insert into the database
    return fetchBarstoolData(queryProps.league).then((res) => ({
      updatedAt: now,
      data: res,
      fresh: true,
    }))
  }

  const handleCacheState = async (promisedCache) => {
    const cachedResult = await promisedCache

    if (cachedResult.fresh)
      return mongo.db
        .collection(queryProps.league)
        .updateOne(
          { _id: queryProps.matchId },
          {
            $set: {
              updatedAt: cachedResult.updatedAt,
              data: cachedResult.data,
            },
          }
        )
        .then(() => ({
          data: cachedResult.data,
          updatedAt: cachedResult.updatedAt,
        }))

    if (cachedResult.newRecord)
      return mongo.db
        .collection(queryProps.league)
        .insertOne({
          _id: queryProps.matchId,
          data: cachedResult.data,
          updatedAt: cachedResult.updatedAt,
        })
        .then(() => ({
          data: cachedResult.data,
          updatedAt: cachedResult.updatedAt,
        }))

    return cachedResult
  }

  return MongoBox(queryProps)
    .map(getDocumentById)
    .map(validateCache)
    .map(handleCacheState)
}
