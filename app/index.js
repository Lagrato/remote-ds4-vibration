const socket = require('socket.io');
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const io = new socket.Server(server);
const VIBRATION_CHECK_TIME = 10000;

let userCount = 0;
let vibrating = 0;

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
})

io.on('connection', socket => {
    userCount++;
    io.emit('userCount', {userCount})
    io.emit('vibrationUpdate',{vibrating})
    socket.on('vibration', msg => {
        io.emit('vibration', msg)
    });
    socket.on('disconnect', () => {
        userCount--;
        vibrating = 0;
        io.emit('vibrationCheck', {});
        io.emit('userCount', {userCount})
    })
    socket.on('vibrationIncrease', () => {
        vibrating++;
        io.emit('vibrationUpdate',{vibrating})
    })
    socket.on('vibrationDecrease', () => {
        vibrating--;
        io.emit('vibrationUpdate',{vibrating})
    })
});

server.listen(process.env.PORT || 5000, () => {
    console.log('listening');
});
