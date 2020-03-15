
// Using express and socket
var express = require('express'); 
var socket = require('socket.io');

// instantiating packages
var app = express();
var server = app.listen(3000);
var io = socket(server);

// Setting up event listener
io.sockets.on('connection', newConnection)

// On new connection log stuff 
// for debugging and broadcast the state data
function newConnection(socket) {
    console.log('new connection' + socket.id);

    socket.on('stateChange', stateChange)

    function stateChange(data) {
        socket.broadcast.emit('stateChange', data);
        console.log(data);
    }
}

// Use public folder for file acess
app.use(express.static("public"));
