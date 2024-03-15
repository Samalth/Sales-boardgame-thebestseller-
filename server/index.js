const express = require("express")
const app = express()
const path = require('path')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')

const databaseQuestion  = require("./database")

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

//join game, to create game look at views folder
io.on('connection', (socket)=>{
    console.log(`User connected: ${socket.id}`)

    socket.on("join_room", (data) =>{
        socket.join(data)
    })

    socket.on("send_message", (data) =>{
        // socket.broadcast.emit("receive_message", data)
        socket.to(data.room).emit("receive_message", data)
    })

    socket.on('send_question_request', async (data) => {
        console.log(data.questionNumber)
        var questionText = await databaseQuestion(data.questionNumber);
        // console.log(JSON.stringify(questionText))
        socket.emit('receive_question', JSON.stringify(questionText))
    })
})

server.listen(3001, () => {
    console.log("server is running on port 3001")
})