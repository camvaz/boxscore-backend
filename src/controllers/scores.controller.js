import { time } from '../utils/time'
import { MongoBox, MongoProp } from '../utils/mongo'

const ReadProps = MongoProp({ league: 'nba' })
export const read = (props = ReadProps) => ({
  game: (_id) =>
    MongoBox(props).map(({ mongo, league }) =>
      mongo.collection(league).findOne({ _id })
    ),
  games: () =>
    MongoBox(props).map(({ mongo, league }) =>
      mongo.collection(league).find({}).toArray()
    ),
})

const UpdateProps = MongoProp({ league, _id })
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

const CreateProps = MongoProp({ league, score, updatedAt })
export const create = (createProps = CreateProps) => ({
  one: ({ score, updatedAt }) =>
    MongoBox(createProps).map(({ mongo, league }) =>
      mongo.collection(league).insertOne({
        score,
        updatedAt: createProps.updatedAt ?? updatedAt ?? time.unix(),
      })
    ),
})
