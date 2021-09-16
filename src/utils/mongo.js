import { Right, Left } from './either.js'

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
    console.log('mongoprops', props)
    props['error'] = 'Mongo not initialized'
    return Left(props)
  }

  return Right(props)
}
