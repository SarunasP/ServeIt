var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(path.join(process.argv[2], "")));
var clientPool = {};
var clients = {};
var totalConnection = 0; // Current Number of clients connected to the server at one time.
var accept = true;
var host = null;
var gameState = null;
var maxConnection = process.argv[4] || 10;
var portNumber = process.argv[3] || 8000;
var gameData = {};
app.get('/', function(req, res) {
    res.sendfile('index.html');
}); //Set what web page be the home page when user open the web browser.
//(This can be used to set the chosen game).



// The function which call when new socket is connected.
// 'connection' here is a tag. IO do different things based on the request tag. 
io.on('connection', function(socket) {
    var clientIP = socket.handshake.address;
    var clientID = socket.id;
    totalConnection++;
    console.log("Socket Information: " + clientIP + " with ID: " + clientID + "try to connect");
    console.log("totalConnection: " + totalConnection);
    if (host == null && clientIP == "127.0.0.1") {
        host = clientID;
    };

    var dataToSend = {
        "accept": accept,
        "totalClients": totalConnection,
        "host": host,
        "clientID": clientID,
        "clientIP": clientIP,
        "maxClient": maxConnection,
        "gameState": gameState
    }

    io.to(socket.id).emit('getConnected', dataToSend);

    socket.on('accept', function(obj) {
        if (!clients[socket.id]) {
            clients[socket.id] = obj;
            clientPool[socket.id] = obj;
        }

        var dataToSend = {
            "clients": clients
        }

        io.emit('accepted', dataToSend);
    });

    socket.on("serverClose", function(msg) {
        accept = false;
        io.emit('serverClose', msg);
    });

    socket.on("serverOpen", function(msg) {
        accept = true;
        io.emit('serverOpen', msg);
    });

    socket.on('changeState', function(msg) {
        console.log(clientID + " with IP " + clientIP + " change the game state to " + msg.state);
        gameState = msg.state;
        io.emit('changeState', msg);
    });

    socket.on('gameOperate', function(obj) {
        console.log("Client " + clientID + " send operate " + obj.action);
        io.emit(obj.action, obj);
    });

    socket.on("update", function(msg) {
        if (clients[socket.id]) {
            clients[socket.id] = msg.obj;
            clientPool[socket.id] = msg.obj;
            var dataToSend = {
                "clientID": msg.clientID,
                "obj": msg.obj,
                "clients": clients
            };
            io.emit("update", dataToSend);
        };
    });

    socket.on("getInfo", function() {
        var dataToSend = {
            "accept": accept,
            "totalClients": totalConnection,
            "host": host,
            "clientID": clientID,
            "clientIP": clientIP,
            "maxClient": maxConnection,
            "gameState": gameState
        }
        io.to(socket.id).emit('getInfo', dataToSend);
    });

    socket.on("setGameData", function(data) {
        gameData = data;
        io.emit('setGameData', gameData);
    });

    socket.on("getGameData", function() {
        io.to(socket.id).emit('getInfo', gameData);
    });

    socket.on('disconnect', function(msg) {

        if (clients[socket.id]) {
            delete clients[socket.id];
        };
        if (host == clientID) {
            console.log("host disconnect");
            host = null;
        };
        totalConnection--;
        if (totalConnection == 0) {
            resetServer();
        };
        var dataToSend = {
            "clients": clients,
            "clientID": socket.id,
            "host": host
        };
        console.log("Socket Information: " + clientIP + " with ID: " + clientID + " disconnect");
        console.log("totalConnection: " + totalConnection);
        io.emit('disconnection', dataToSend);

    });


    socket.on('ping', function(msg) {
        io.to(socket.id).emit('pong', msg);
    });

    //TODO Reconnect function.The basic logic is in below but need a future test.
    //var reconnectable = true;
    //socket.on("reconnectClose", function(msg) {
    //    reconnectable = false;
    //    io.emit('reconnectClose', msg);
    //});

    //socket.on("reconnectOpen", function(msg) {
    //    reconnectable = true;
    //    io.emit('reconnectOpen', msg);
    //});

    //socket.on('reconnectToGame',function(msg) {
    //    if (!reconnectable){
    //        io.to(socket.id).emit('failedToReconnect');
    //        return;
    //    }
    //    if (clientPool[msg.clientID]){
    //        clients[socket.id] = clientPool[msg.clientID];
    //        clientPool[socket.id] = clientPool[msg.clientID];
    //        delete  clientPool[msg.id];
    //        var dataToSend = {
    //            "clients": clients,
    //            "clientID": socket.id
    //        }
    //        io.emit("reconnectToGame",dataToSend);
    //    } else {
    //        io.to(socket.id).emit('failedToReconnect');
    //    }
    //});
    //TODO Functionality of Reading & Writing Files.
});

function resetServer() {
    console.log("server reset");
    clients = {};
    totalConnection = 0; // Current Number of clients connected to the server at one time.
    accept = true;
    host = null;
    gameState = null;
    reconnectable = true;
}
//http server begin to listening
http.listen(portNumber, function() {
    console.log("Success")
    console.log('listening on *:' + portNumber);
});