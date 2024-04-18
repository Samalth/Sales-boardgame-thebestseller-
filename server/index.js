const express = require("express")
const app = express()
const path = require('path')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const fs = require('fs');

const databaseQuestion  = require("./database")
const databaseAnswer  = require("./database")
const userLogger = require('./userLogger')
const modLogger = require('./modLogger')
const getMovesFromCoordinate = require('./positionCalculator')


app.use(cors())

fs.writeFileSync('data.json', '{\n  "users": [],\n  "mods": []\n}');

const server = http.createServer(app)

const io = new Server(server, { 
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

//create game
io.on('connection', (socket)=> {
    // modLogger("log", socket.id)

    // socket.on("disconnect", (reason) => {
    //     // console.log(reason)
    //     modLogger("delete", socket.id)
    // })

    socket.on("create_room", (data) => {
        // modLogger('updateRoom', socket.id, data.room)
        const room = modLogger('log', socket.id);
        userLogger("updateRoom", socket.id, room);
        socket.join(room)
        socket.emit("send_gamepin", room);
    })

    //join game
    userLogger("log", socket.id)

    socket.on("disconnect", (reason) => {
        // console.log(reason)
        socket.to(userLogger("getRoom", socket.id)).emit('delete_user', "deleting")
        userLogger("delete", socket.id)
        modLogger("delete", socket.id)
    })

    socket.on("join_room", (data) => {
        var exists = modLogger('checkExists', socket.id, data.room)
        if (exists === 'exists') {
            socket.join(data.room)
            var availability = userLogger('checkAvailability', socket.id, data)
        } else{
            availability = 'Room does not exist'
        }
        
        // console.log(availability)
        if (availability === 'available') {
            socket.join(data.room)
            socket.to(data.room).emit('add_user', "adding")
            userLogger('updateName', socket.id, data.name)
            userLogger('updateRoom', socket.id, data.room)
            userLogger('updatePoints', socket.id, data.points)
            userLogger('updateStrategy', socket.id, data.strategy)

            // get mod from room code and add the player to the mod's players_joined array
            const modID = modLogger('getMod', socket.id, data.room)
            modLogger('addPlayer', modID, data.strategy.toLowerCase())
            const pieces = modLogger('getPieces', modID)

            socket.emit('join_succes', availability);
            socket.emit('add_piece', pieces);
            socket.to(data.room).emit('add_piece', pieces);
        } else {
            socket.emit('join_succes', availability);
        }
    })

    socket.on("get_pieces", (data) => {
        var modID;
        switch (data){
            case 'player':
                const room = userLogger('getRoom', socket.id);
                modID = modLogger('getMod', socket.id, room);
                break
            case 'mod':
                modID = socket.id
                break
        }
        const pieces = modLogger('getPieces', modID)
        socket.emit('add_piece', pieces)
    })

    socket.on('send_question_request', async (data) => {
        var questionText = await databaseQuestion(data.questionColor);

        const room = userLogger('getRoom', socket.id);
        socket.to(room).emit('mod-pause', questionText);
        socket.emit('receive_question', questionText);
    })

    socket.on('send_answer_request', async (data) => {
        var answerText = await databaseAnswer(data.answerColor, 'answer');
        const room = userLogger('getRoom', socket.id);
        socket.to(room).emit('receive_answer', answerText);
        socket.emit('receive_answer', answerText);
    })

    socket.on("roll_dice", (data) => {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        const room = userLogger("getRoom", socket.id)
        socket.to(room).emit("set_dice", diceValue)
        socket.emit("set_dice", diceValue)
    })

    socket.on('send_dice_roll_and_position', (data) =>{
        // console.log(data)
        const coordinate = data.position.split('-');
        const xPos = parseInt(coordinate[0]);
        const yPos = parseInt(coordinate[1]);
        const moves = getMovesFromCoordinate(xPos, yPos, data.diceValue);

        // console.log(moves);

        const formattedPositions = moves.map(pos => `${pos.x}-${pos.y}`)
        // console.log(formattedPositions);
        const room = userLogger('getRoom', socket.id);
        socket.to(room).emit('update_valid_positions', formattedPositions);
        socket.emit('update_valid_positions', formattedPositions);
    })

    socket.on('send_textbox_content', (data) => {
        const room = userLogger('getRoom', socket.id);
        console.log(data);
        socket.to(room).emit('submitted_answer', data);
    })

    socket.on('send_points', (data) => {
        const oldPoints = userLogger('getPoints', socket.id);
        const points = userLogger('updatePoints', socket.id, parseInt(oldPoints + data.points));
    })

    socket.on("update_position", (data) => {
        const room = userLogger('getRoom', socket.id);
        socket.to(room).emit('update_position', data);
        // socket.emit('update_position', data);
    })

    socket.on("submit_points", (data) => {
        const room = userLogger('getRoom', socket.id);
        socket.to(room).emit('submitted_points', data.points);
        console.log("send to playboard: " + data.points);
    })
})

server.listen(3001, () => {
    console.log("server is running on port 3001")
})