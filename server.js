const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', socket => {
    console.log('User connected');

    socket.emit('user-connected');

    socket.on('test', () => {
        socket.emit('data-received', `${new Date()} : New log line`);
    });
});


server.listen(3000, () => {
    console.log('Server listening on port 3000');
});