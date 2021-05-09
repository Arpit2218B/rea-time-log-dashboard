const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

let filePath = null;
let watcher = null;


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

const writeLogs = (socket) => {
    const readData = fs.readFileSync(filePath, {encoding: 'utf-8'});
    const a = readData.split('\n');
    socket.emit('data-received', {data: a});
}

io.on('connection', socket => {
    filePath = socket.handshake.query.filepath;
    console.log('User connected');
    
    try {
        writeLogs(socket);
        watcher = fs.watch(filePath, (event, filename) => {
            if(filename && event === 'change') {
                writeLogs(socket);
            }
        });
        socket.emit('user-connected');
    }
    catch(ex) {
        socket.emit('wrong-filepath');
    }

    socket.on('disconnect', () => {
        watcher.close();
        console.log('User disconnected');
        filePath = null;
    });
});


server.listen(3000, () => {
    console.log('Server listening on port 3000');
});