require('dotenv').config()

const WebSocket = require('ws')
const genMaze = require('./src/utils/genMaze.js')

const wss = new WebSocket.Server({ port: process.env.WSS_PORT })

WebSocket.prototype.sendJSON = function (data) {
  return this.send(JSON.stringify(data))
}

const levelCache = {
  get (n) {
    if (!this[n])
      this[n] = genMaze(n + 2, n + 2)
    return this[n]
  }
}

wss.on('connection', conn => {
  console.log('connection made')
  conn.on('message', msg => {
    console.log(msg)
  })
  conn.sendJSON({
    e: 'NEW_MAZE',
    d: levelCache.get(1)
  })
})

wss.on('listening', () => {
  console.log('listening on port %s', process.env.WSS_PORT)
})
