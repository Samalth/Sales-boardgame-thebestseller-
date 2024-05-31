const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const fs = require('fs');
const socketInit = require('./socketInit')
const sockets = require('./Sockets')
const gameSockets = require('./gameSockets')
fs.writeFileSync('data.json', '{\n  "users": [],\n  "mods": []\n}');
const server = http.createServer(app)

const io = socketInit(server)
sockets(io)
gameSockets(io)

app.use(cors())

server.listen(3001, () => {
    console.log('server is running on port 3001')
})