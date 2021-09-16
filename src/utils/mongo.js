import { Right, Left } from './either.js'

export const MongoProp = (props) => ({ mongo: null, ...props })
export const MongoBox = (props) => {
  if (!props.mongo) {
    props['error'] = 'Mongo not initialized'
    return Left(props)
  }

  return Right(props)
}
