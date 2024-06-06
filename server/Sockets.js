const modLogger = require("./modLogger");
const databaseQuestion = require("./database");
const userLogger = require("./userLogger");
const databaseAnswer = require("./database");
const getMovesFromCoordinate = require("./positionCalculator");

module.exports = function (io){

    io.on('connection', (socket) => {
        userLogger('log', socket.id)

        const socketHandlers = {

            'create_room': (data) => {
                const room = modLogger('log', socket.id, data);
                const playerNeeded = modLogger('getPlayerTotal', socket.id)
                socket.join(room)
                socket.emit('send_gamepin', {room: room, playerTotal: playerNeeded});
            },

            'disconnect': (reason) => {
                const room = userLogger("getRoom", socket.id)
                const name = userLogger('getPlayerName', socket.id)
                modLogger('removeUser', socket.id, {name: name, room: room})
                socket.to(userLogger("getRoom", socket.id)).emit('delete_user', "deleting")
                userLogger("delete", socket.id)
                modLogger("delete", socket.id)
            },

            'join_room' : (data) => {
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
                var roomIsFull = modLogger('checkFull', socket.id, data.room)
                if (roomIsFull === 'full') {
                    availability = 'Room is full'
                }
                if (availability === 'available') {
                    socket.join(data.room)
                    socket.to(data.room).emit('add_user', "adding")
                    userLogger('updateName', socket.id, data.name)
                    userLogger('updateRoom', socket.id, data.room)
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
            },

            'send_question_request': async (data) => {
                const availableColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
                const language = userLogger('getLanguage', socket.id)
                const { question, answer } = await databaseQuestion(data.questionColor, sort = language);
                const room = userLogger('getRoom', socket.id);
                let popupColor
                if (data.questionColor === 'rainbow') {
                    data.questionColor = data.userColor
                    popupColor = data.userColor;
                }
                switch (data.questionColor) {
                    case 'chance':
                        popupColor = 'black1';
                        break;
                    case 'sales':
                        popupColor = 'black2';
                        break;
                    case 'megatrends':
                        popupColor = 'black3';
                        break;
                    default:
                        popupColor = data.questionColor;
                }

                if (availableColors.includes(data.questionColor)){
                    const receiver = userLogger('getReceiver', socket.id, {color: data.questionColor, room: room})
                    socket.to(room).emit('mod-pause', {questionText: question, color: popupColor, userColor: popupColor, answer: answer});
                    io.to(receiver).emit('receive_question', {questionText: question, color: popupColor, userColor: data.userColor})
                } else {
                    socket.to(room).emit('mod-pause', {questionText: question, color: popupColor, userColor: data.userColor, answer: answer});
                    socket.emit('receive_question', {questionText: question, color: popupColor, userColor: data.userColor});
                }
            },

            'send_answer_request' :  async (data) => {
                let answerText = await databaseAnswer(data.answerColor, 'answer');
                const room = userLogger('getRoom', socket.id);
                socket.to(room).emit('receive_answer', answerText);
                socket.emit('receive_answer', answerText);
            },

            'change_language' : (data) => {
                userLogger('updateLanguage', socket.id, data)
            },

            'send_points' : (data) => {
                const oldPoints = userLogger('getPoints', socket.id);
                const points = userLogger('updatePoints', socket.id, parseInt(oldPoints + data.points));
            },

            'submit_points' : (data) => {
                const room = modLogger('room', socket.id);
                let name = modLogger('getPlayerName', socket.id)
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

                const roundInfo = modLogger('getRound', socket.id);
                socket.to(room).emit('rounds', roundInfo);
                socket.emit('rounds', roundInfo);
            },

            'settings' : (data) => {
                modLogger('updateSettings', socket.id, data)
            },

            'send_textbox_content' : (data) => {
                const room = userLogger('getRoom', socket.id);
                socket.to(room).emit('submitted_answer', data);
            },

            'update_position' : (data) => {
                const room = userLogger('getRoom', socket.id);
                socket.to(room).emit('update_position', data);
            },

            'pawns_request_failed' : (data) => {
                const room = userLogger('getRoom', socket.id);
                const modID = modLogger('getMod', socket.id, room);
                const strategy = modLogger('getPlayerTurn', modID)
                socket.emit('players_turn', strategy)
            },

            'get_data' : (userData) => {
                const room = userLogger('getRoom', socket.id);
                userData = userLogger('getData', socket.id);
                socket.to(room).emit('data_leaderboard', userData);
                socket.emit('data_leaderboard', userData);
            },

            'get_playerstrategy' : (data) => {
                const strategy = userLogger('getStrategy', socket.id);
                const color = userLogger('getColor', socket.id);
                socket.emit("register_currentplayer", {strategy: strategy, color: color});
            },

            'get_current' : (data) => {
                const strategy = modLogger('getPlayerTurn', socket.id)
                socket.emit('set_current_player', strategy)
            }
        }
        Object.keys(socketHandlers).forEach(event => {
            socket.on(event, socketHandlers[event])})
    })
}