const express = require("express")
const app = express()
const path = require('path')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')

const databaseQuestion  = require("./database")
const userLogger = require('./userLogger')
const modLogger = require('./modLogger')


app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

//create game
io.on('connection', (socket)=>{
   modLogger("log", socket.id)

    socket.on("disconnect", (reason) =>{
        // console.log(reason)
        modLogger("delete", socket.id)
    })

    socket.on("create_room", (data) =>{
        socket.join(data.room)
        modLogger('updateRoom', socket.id, data.room)
    })


    //join game
    userLogger("log", socket.id)
    
    socket.on("disconnect", (reason) =>{
        // console.log(reason)
        userLogger("delete", socket.id)
    })

    socket.on("join_room", (data) =>{
        socket.join(data.room)
        userLogger('updateName', socket.id, data.name)
        userLogger('updateRoom', socket.id, data.room)
        userLogger('updateStrategy', socket.id, data.strategy)
    })

    socket.on('send_question_request', async (data) => {
        console.log(data.questionNumber)
        var questionText = await databaseQuestion(data.questionNumber);
        // console.log(JSON.stringify(questionText))
        // socket.to(userLogger('getRoom', socket.id)).emit('receive_question', JSON.stringify(questionText))
        const room = userLogger('getRoom', socket.id);
        socket.to(room).emit('receive_question', JSON.stringify(questionText));
        socket.emit('receive_question', JSON.stringify(questionText));
    })
})

server.listen(3001, () => {
    console.log("server is running on port 3001")
})