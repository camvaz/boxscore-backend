'use strict'
import fastify from 'fastify'
import fetch from 'node-fetch'

const app = fastify({
  logger: true,
})

app.register(import('fastify-mongodb'), {
  forceClose: true,
  url: 'mongodb://localhost:27017/boxscore-cache',
})

app.get('/nba', (req, reply) => {
  fetch(
    'https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json'
  )
    .then((res) => res.json())
    .then((json) => {
      reply.send(JSON.stringify(json, null, 2))
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
