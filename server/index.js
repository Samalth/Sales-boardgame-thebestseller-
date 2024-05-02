const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const fs = require('fs');
const databaseQuestion  = require('./database')
const databaseAnswer  = require('./database')
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

io.on('connection', (socket)=> {

    socket.on('create_room', (data) => {
        const room = modLogger('log', socket.id);
        socket.join(room)
        socket.emit('send_gamepin', room);
    })

    userLogger('log', socket.id)

    socket.on("disconnect", (reason) => {
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
        if(data.strategy === ''){
            availability = 'Choose a strategy'
        }
        if (availability === 'available') {
            socket.join(data.room)
            socket.to(data.room).emit('add_user', "adding")
            userLogger('updateName', socket.id, data.name)
            userLogger('updateRoom', socket.id, data.room)
          /*  const points = data.points !== undefined ? parseInt(data.points) : 0;*/
           /* userLogger('updatePoints', socket.id, data.points)*/
            userLogger('updateStrategy', socket.id, data.strategy)
            const modID = modLogger('getMod', socket.id, data.room)
            modLogger('addPlayer', modID, data.strategy.toLowerCase())
            modLogger('addPlayerName', modID, data.name)
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
        const availableColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
        var questionText = await databaseQuestion(data.questionColor);
        var popupColor = data.questionColor;

        const room = userLogger('getRoom', socket.id);
        switch (data.questionColor) {
            case 'chance':
                popupColor = 'black';
                break;
            case 'sales':
                popupColor = 'black';
                break;
            case 'megatrends':
                popupColor = 'black';
                break;
            case 'rainbow':
                popupColor = data.userColor;
                break;
            default:
                popupColor = data.questionColor;
        }

        console.log('popupColor: ', popupColor);
        console.log('data.userColor: ', data.userColor);
        console.log('data.questionColor: ', data.questionColor);
        if (availableColors.includes(data.questionColor)){
            console.log('other color')
            const receiver = userLogger('getReceiver', socket.id, {color: data.questionColor, room: room})
            console.log(receiver)
            socket.to(room).emit('mod-pause', {questionText: questionText, color: popupColor, userColor: data.userColor});
            io.to(receiver).emit('receive_question', {questionText: questionText, color: popupColor, userColor: data.userColor})
        } else{
            socket.to(room).emit('mod-pause', {question: questionText, color: popupColor, userColor: data.userColor});
            socket.emit('receive_question', {questionText: questionText, color: popupColor});
        }
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
        const coordinate = data.position.split('-');
        const xPos = parseInt(coordinate[0]);
        const yPos = parseInt(coordinate[1]);
        const moves = getMovesFromCoordinate(xPos, yPos, data.diceValue);
        const formattedPositions = moves.map(pos => `${pos.x}-${pos.y}`)
        const room = userLogger('getRoom', socket.id);
        socket.to(room).emit('update_valid_positions', formattedPositions);
        socket.emit('update_valid_positions', formattedPositions);
    })

    socket.on('send_textbox_content', (data) => {
        const room = userLogger('getRoom', socket.id);
        socket.to(room).emit('submitted_answer', data);
    })

    socket.on('send_points', (data) => {
        const oldPoints = userLogger('getPoints', socket.id);
        const points = userLogger('updatePoints', socket.id, parseInt(oldPoints + data.points));
    })

    socket.on("update_position", (data) => {
        const room = userLogger('getRoom', socket.id);
        socket.to(room).emit('update_position', data);
    })

    socket.on('submit_points', (data) => {
        const room = modLogger('room', socket.id);
        let name = modLogger('getPlayerName', socket.id)
        // const id = userLogger('getUserIDByName', socket.id , name);
        const id = userLogger('getReceiver', socket.id, {color: data.color, room: room})
        const oldPoints = userLogger('getPoints', id, id);
        const newPoints = Number(oldPoints) + Number(data.points);

        userLogger('updatePoints', id, newPoints);

        socket.to(room).emit('submitted_points', data.points);
        socket.emit('players_name', name)
        modLogger('nextTurn', socket.id)
        name = modLogger('getPlayerName', socket.id);
        const strategy = modLogger('getPlayerTurn', socket.id)
        socket.emit('players_turn', strategy)

        socket.emit('players_name', name)
        socket.to(room).emit('players_turn', strategy)
        socket.to(room).emit('players_name', name)
    })

    socket.on('start_turn', (data) => {
        const room = modLogger('room', socket.id);
        const strategy = modLogger('getPlayerTurn', socket.id)
        const name = modLogger('getPlayerName', socket.id)
        socket.emit('players_turn', strategy)
        socket.emit('players_name', name)
        socket.to(room).emit('players_turn', strategy)
        socket.to(room).emit('players_name', name)
    })

    socket.on('pawns_request_failed', (data) => {
        const room = userLogger('getRoom', socket.id);
        const modID = modLogger('getMod', socket.id, room);
        const strategy = modLogger('getPlayerTurn', modID)
        socket.emit('players_turn', strategy)
    })

    socket.on('get_data', (data) => {
        const room = userLogger('getRoom', socket.id);
        const userData = userLogger('getData', socket.id);
        socket.to(room).emit('data_leaderboard', userData);
        socket.emit('data_leaderboard', userData);
    })

    socket.on('get_playerstrategy', (data) => {
        const strategy = userLogger('getStrategy', socket.id);
        const color = userLogger('getColor', socket.id);
        socket.emit("register_currentplayer", {strategy: strategy, color: color});
    })

})

server.listen(3001, () => {
    console.log('server is running on port 3001, I hope')
})