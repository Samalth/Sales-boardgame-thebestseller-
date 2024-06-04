const userLogger = require("./userLogger");
const getMovesFromCoordinate = require("./positionCalculator");
const modLogger = require("./modLogger");
module.exports = function (io){
    io.on('connection', (socket) => {
        const socketHandlers = {
            'get_tileInfo': (data) => {
                const room = userLogger('getRoom', socket.id);

                //TILE_INFO FOR WHEN 2-6 PLAYERS JOIN
                const tileInfo = [
                    'sales', 'color1', 'color3', 'megatrends', 'rainbow', 'color4', 'chance', 'color2', 'color7', 'sales', 'rainbow', 'color12', 'megatrends', 'color10', 'color8',
                    'color6', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance',
                    'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color11',
                    'color5', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'rainbow',
                    'rainbow', 'sales', 'color8', 'chance', 'color1', 'megatrends', 'color10', 'start', 'rainbow', 'sales', 'color4', 'megatrends', 'color7', 'color6', 'sales',
                    'megatrends', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'sales', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color9',
                    'color10', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color12', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'color4',
                    'color3', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'chance', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'megatrends',
                    'sales', 'rainbow', 'color11', 'chance', 'color2', 'color7', 'megatrends', 'rainbow', 'color9', 'sales', 'color8', 'color6', 'chance', 'rainbow', 'color5'
                ]

                //TILE_INFO FOR WHEN 5 PLAYERS JOIN
                const tileInfo2 = [
                    'sales','color1','color5','megatrends','rainbow','color4','chance', 'color2', 'color1', 'sales','rainbow', 'color3','megatrends','color4','color2',
                    'color3','blank','blank','blank', 'blank','blank', 'blank', 'megatrends', 'blank', 'blank','blank', 'blank', 'blank', 'blank','chance',
                    'chance','blank','blank','blank','blank','blank', 'blank', 'color5', 'blank','blank','blank', 'blank', 'blank','blank','color5',
                    'color5','blank','blank','blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank','rainbow',
                    'rainbow','sales','color2','chance', 'color1','megatrends', 'color4', 'start', 'rainbow', 'sales','color4', 'megatrends', 'color1','color3', 'sales',
                    'megatrends','blank','blank', 'blank', 'blank','blank', 'blank', 'sales', 'blank', 'blank','blank', 'blank', 'blank','blank', 'color5',
                    'color4','blank', 'blank', 'blank', 'blank','blank', 'blank', 'color3', 'blank', 'blank','blank','blank','blank','blank','color4',
                    'color5', 'blank', 'blank', 'blank', 'blank','blank', 'blank', 'chance', 'blank', 'blank','blank', 'blank', 'blank','blank', 'megatrends',
                    'sales', 'rainbow', 'color5', 'chance', 'color2','color1', 'megatrends', 'rainbow', 'color5', 'sales','color2','color3', 'chance', 'rainbow', 'color5'
                ]

                socket.emit('send_tileInfo', tileInfo)
                socket.emit('send_tileInfo2', tileInfo2)
                socket.to(room).emit('send_tileInfo', tileInfo)
                socket.to(room).emit('send_tileInfo2',tileInfo2)
            },

            'roll_dice' : (data) => {
                const diceValue = Math.floor(Math.random() * 6) + 1;
                const room = userLogger("getRoom", socket.id)
                socket.to(room).emit("set_dice", diceValue)
                socket.emit("set_dice", diceValue)
            },

            'send_dice_roll_and_position': (data) => {
                const coordinate = data.position.split('-');
                const xPos = parseInt(coordinate[0]);
                const yPos = parseInt(coordinate[1]);
                const moves = getMovesFromCoordinate(xPos, yPos, data.diceValue);
                const formattedPositions = moves.map(pos => `${pos.x}-${pos.y}`)
                const room = userLogger('getRoom', socket.id);
                socket.to(room).emit('update_valid_positions', formattedPositions);
                socket.emit('update_valid_positions', formattedPositions);
            },

            'start_turn' : (data) => {
                const room = modLogger('room', socket.id);
                const strategy = modLogger('getPlayerTurn', socket.id)
                const name = modLogger('getPlayerName', socket.id)
                socket.emit('players_turn', strategy)
                socket.emit('players_name', name)
                socket.to(room).emit('players_turn', strategy)
                socket.to(room).emit('players_name', name)

                const roundInfo = modLogger('getRound', socket.id);
                socket.to(room).emit('rounds', roundInfo);
                socket.emit('rounds', roundInfo);
            },

            'get_pieces': (data) => {
                let modID;
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
            }
        }
        Object.keys(socketHandlers).forEach(event => {
            socket.on(event, socketHandlers[event])
        })
    })
}