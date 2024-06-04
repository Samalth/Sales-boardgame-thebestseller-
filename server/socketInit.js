const { Server } = require('socket.io');

module.exports = function(server) {
    return new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });
};