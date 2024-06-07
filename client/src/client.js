import io from 'socket.io-client'

export const socket = io.connect('http://localhost:3001')

// export const socket = io.connect({path: '/server', transports: ['websocket', 'polling']})

