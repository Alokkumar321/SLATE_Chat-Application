const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use('/public', express.static(__dirname + '/public'));

const io = require('socket.io')(http);
const users = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-user', (username) => {
        users[socket.id] = username;
        io.emit('user-connected', username); // Broadcast to all users
    });

    socket.on('chat-message', (message) => {
        io.emit('chat-message', { user: users[socket.id], message: message.message });
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit('user-disconnected', username);
    });
});
