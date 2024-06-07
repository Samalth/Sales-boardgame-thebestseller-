const { Server } = require('socket.io');

module.exports = function(server) {
    return new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });
    // VOOR DEPLOYMENT
    // return new Server(server, {
    //     connectionStateRecovery: true,
    //     path: '/server',
    //     cors: {
    //         origin: 'https://thebestsellergame.online',
    //         methods: ['GET', 'POST']
    //     }
    // });
};

