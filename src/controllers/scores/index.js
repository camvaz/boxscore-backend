import { MongoProp } from '../../utils/mongo.js'
import { getGame } from './read.controller.js'

/**
 * @function ReadProps - Parameters to read from the database
 *@param {object} req
 *@param {object} res
 *@param {object} league
 */
const ReadProps = MongoProp({ league: 'nba' })

/**
 * @param {Object} ReadProps - MongoDB connection properties
 */
export const read = ({ req, mongo } = ReadProps) => ({
  // Get a game from the database
  game: (gameProps) => getGame(gameProps, { req, mongo }),
})
