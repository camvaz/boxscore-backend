import { time } from '../utils/time.js'
import { logger } from '../utils/logger.js'
import { MongoBox, MongoProp } from '../utils/mongo.js'

const ReadProps = MongoProp({ league: 'nba' })

export const read = ({ req, mongo } = ReadProps) => ({
  game: (gameProps) =>
    MongoBox({
      mongo,
      league: req.params.league ?? gameProps.league,
      matchId: req.params.matchId ?? gameProps.matchId,
    }).map(({ mongo, league, matchId }) =>
      mongo.db.collection(league).findOne({ _id: matchId })
    ),
  games: () =>
    MongoBox(props).map(({ mongo, league }) =>
      mongo.collection(league).find({}).toArray()
    ),
})

const UpdateProps = MongoProp({ league: 'nba', _id: 'nba' })
export const update = (updateProps = UpdateProps) => ({
  game: ({ _id, score }) =>
    MongoBox(updateProps).map(({ mongo, league }) =>
      mongo
        .collection(league)
        .updateOne(
          { _id: updateProps._id ?? _id },
          { $set: { score, updatedAt: time.unix() } }
        )
    ),
})

const CreateProps = MongoProp({
  league: 'nba',
  score: {},
  updatedAt: time.unix(),
})
export const create = (createProps = CreateProps) => ({
  one: ({ score, updatedAt }) =>
    MongoBox(createProps).map(({ mongo, league }) =>
      mongo.collection(league).insertOne({
        score,
        updatedAt: createProps.updatedAt ?? updatedAt ?? time.unix(),
      })
    ),
})
