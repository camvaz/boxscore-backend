import { MongoProp } from '../../utils/mongo.js'
import { getGame } from './read.controller.js'

const ReadProps = MongoProp({ league: 'nba' })

export const read = ({ req, mongo } = ReadProps) => ({
  game: (gameProps) => getGame(gameProps, { req, mongo }),
})
