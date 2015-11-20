var express = require('express');
var app = express(); 
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(path.join(__dirname, '')));
var clients = {};
var totalConnection = 0;// Current Number of clients connected to the server at one time.
var clientNumber = 1;
var accept = true;
var host = false;
var gameState = false;

app.get('/', function(req, res){
  res.sendFile('index.html');
}); //Set what web page be the home page when user open the web browser.
    //(This can be used to set the chosen game).



// The function which call when new socket is connected.
// 'connection' here is a tag. IO do different things based on the request tag. 
io.on('connection', function(socket) {
    var clientIP = socket.handshake.address;
    var clientID = socket.id;
    totalConnection++;
    console.log("Socket Information: " + clientIP + " with ID: "+ clientID + " has tried to connect");
    console.log("totalConnection: "+ totalConnection);
    if (!host && clientIP == "127.0.0.1") {
        host = clientID;
    };

    var dataToSend = {
        "accept" : accept,
		"clientNumber": clientNumber,
        "totalClients" : totalConnection,
        "host" : host,
        "clientID" : clientID,
        "clientIP" : clientIP
    }
	clientNumber++;
    io.to(socket.id).emit('getConnected', dataToSend);

//------------------------------------------//

    socket.on('accept',function(obj) {
        if (!clients[socket.id]) {
            clients[socket.id] = obj;
        }
        var dataToSend = {
			"clientID" : clientID,
            "clients" : clients
        }

        io.emit('accepted',dataToSend);
    });

//------------------------------------------// 
    socket.on("serverClose",function(msg){
        accept = false;
        io.emit('serverClose', msg);
    });

    socket.on("serverOpen",function(msg){
        accept = true;
        io.emit('serverOpen', msg);
    });

//----------------------------------------//

    socket.on('changeState',function(msg){
        console.log(clientID + " with IP " + clientIP + " has changed the game state to " + msg.state);
        gameState = msg.state;
        io.emit('changeState',msg);
    });

//---------------------------------------//

    socket.on('gameOperate',function(obj){
        console.log("Client "+ clientID +" has sent	operation " + obj.action);
        io.emit('gameOperate', obj);
        if (obj.hasOwnProperty('time')) {
            console.log("ping: " + (Date.now() - obj.time));
        };    
    });

//--------------------------------------//
    socket.on("update",function(msg){
        if (clients[msg.clientId]) {
            clients[msg.clientId] = msg.obj;
            var dataToSend = {
                "clientId" : msg.clientId,
                "obj" : msg.obj,
                "clients" : clients
            };
        io.emit("update",dataToSend);
        };
    });

//--------------------------------------//

    socket.on("getInfo",function(){
        var dataToSend = {
            "accept" : accept,
            "totalClients" : totalConnection,
            "host" : host,
            "clientID" : clientID,
            "clientIP" : clientIP
        }
        io.to(socket.id).emit('updatedInfo', dataToSend);
    });
//--------------------------------------//

    socket.on('disconnect',function(msg){

        if(clients[socket.id]){
            delete clients[socket.id];
        };
        if (host == clientID){
            console.log("host disconnect");
            host = false;
        };
        totalConnection--;
        if (totalConnection==0) {
            resetServer();
        };
		clientNumber--;
        var dataToSend = {
            "clients" : clients,
            "clientId" : socket.id,
            "host" : host
        };
        console.log("Socket Information: " + clientIP + " with ID: "+ clientID + " disconnect");
        console.log("totalConnection: "+ totalConnection);
        io.emit('disconnection',dataToSend);
        
    });

//--------------------------------------//

    socket.on('ping',function(msg){
        io.to(socket.id).emit('ping', msg);
    });

//--------------------------------------//

});

function resetServer(){
    console.log("server reset");
    clients = {};
    totalConnection = 0;// Current Number of clients connected to the server at one time.
    accept = true;
    host = false;
    gameState = false;
}
//http server begin to listening
http.listen(3000, function(){
  console.log('listening on *:3000');
});
