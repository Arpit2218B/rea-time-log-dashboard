const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const fs = require('fs');


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

const writeLogs = (socket) => {
    const readData = fs.readFileSync('./test.log', {encoding: 'utf-8'});
    const a = readData.split('\n');
    socket.emit('data-received', {data: a});
}

io.on('connection', socket => {
    console.log('User connected');
    
    socket.emit('user-connected');

    writeLogs(socket);

    fs.watch('./test.log', (event, filename) => {
        if(filename && event === 'change') {
            writeLogs(socket);
        }
    });
});


server.listen(3000, () => {
    console.log('Server listening on port 3000');
});