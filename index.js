'use strict'
import fastify from 'fastify'
import fetch from 'node-fetch'

import { logger } from './src/utils/logger.js'
import * as ScoresController from './src/controllers/scores.controller.js'
import { identity } from './src/utils/identity.js'

const app = fastify({
  logger: true,
})

app.register(import('fastify-mongodb'), {
  forceClose: true,
  url: 'mongodb://localhost:27017/boxscore-cache',
})

const stringify = (obj) => JSON.stringify(obj, null, 2)

app.get('/scores/:league/:matchId', function (req, reply) {
  const promise = ScoresController.read({ req, reply, mongo: this.mongo })
    .game()
    .fold(identity, identity)

  promise.then((game) => {
    reply.send(stringify(game))
  })
})

app.get('/mlb', (req, reply) => {
  fetch(
    'https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json'
  )
    .then((res) => res.json())
    .then((json) => {
      reply.send(JSON.stringify(json, null, 2))
    })
})

app.listen(3000, (err) => {
  if (err) throw err
  console.log('Listening on 3000')
})

const start = async () => {
  try {
    await app.listen(3000)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
