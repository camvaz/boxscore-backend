import { Right, Left } from './either'

export const MongoProp = (props) => ({ mongo: null, ...props })
export const MongoBox = (props) => {
  if (!props || !props.mongo) {
    props['error'] = 'Mongo not initialized'
    return Right(MongoBox, props)
  }

  return Left(MongoBox, props)
}
