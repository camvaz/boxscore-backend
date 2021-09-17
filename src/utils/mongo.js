'use strict'
import { Right, Left } from './types.js'

/**
 *
 * @param {object} props
 * @returns
 */
export const MongoProp = (props) => ({ mongo: null, ...props })
/**
 *
 * @param {object} props
 * @returns Left | Right
 */
export const MongoBox = (props) => {
  if (!props.mongo) {
    props['error'] = 'Mongo not initialized'
    return Left(props)
  }

  return Right(props)
}
