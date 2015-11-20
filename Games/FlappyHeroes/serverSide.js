var Client = function(){	
	this.socket = io({forceNew:true});;
	this.clients = {};	
	this.character = 0;
	this.id;
	this.timeStamp;
	this.clientIP;
	this.host;
	this.hostRight = false;
	this.clientState = game.stateList.chooseState;
	this.heartBeat;
	this.socket.on('getConnected',function(data){
		if (!data.accept) {
			this.socket.disconnect();
			alert("Game is running, please join later.");
			return;
		};

		if (data.host == null) {
			this.socket.disconnect();
			alert("Please wait for host first before choosing a character.");
			return;
		};
		if (data.totalClients > data.maxClient){			
			this.socket.disconnect();
			alert("No more places, please try again later.");
			return;
		};
		if(this.id == null){
			this.id = data.clientID;
			this.clientIP = data.clientIP;
			this.host = data.host;
			if(data.host == this.id){
				this.hostRight = true;
			}
		}
		game.state.start('startState');
		this.clientState = game.stateList.startState;
		this.heartBeat = setTimeout(function(){
			alert("lose connection with server.");
			this.disconnect();
		}.bind(this),6000);
		this.ping();
	}.bind(this));

	this.socket.on("accepted",function(data){
		this.clients = data.clients;
		this.refreshCountLabel();
	}.bind(this));

	this.socket.on("changeState",function(msg){
		this.clientState = msg.state;
		if (this.clientState == game.stateList.gameState) {
			this.timeStamp = msg.timeStamp;
			game.state.start('gameState'); 
			return;
		};
		if (this.clientState == game.stateList.gameOverState) {
			game.state.start('gameOverState'); 
			return;
		};
	}.bind(this));

	this.socket.on('pong',function(msg){
		var ping =Math.floor((Date.now() - msg.time)/2);
		if (gameState.labelPing) {
			gameState.labelPing.text = "Ping: " + ping;
		};
		if (startState.labelPing){
			startState.labelPing.text = "Ping: " + ping;
		}
		this.ping();
		clearTimeout(this.heartBeat);
		this.heartBeat = setTimeout(function(){
			alert("lost connection with server.");
			this.disconnect();
		}.bind(this),6000);
	}.bind(this));	

    this.socket.on('jump',function(obj){
    	gameState.jump(obj.clientId);
    }.bind(this));

    this.socket.on('hitPipe',function(obj){
    	gameState.birds[obj.clientId].body.velocity.x = -200;
        gameState.birds[obj.clientId].alive=false;
    }.bind(this));

    this.socket.on('die',function(obj){
    	gameState.die(obj.clientId);
    }.bind(this));

    this.socket.on('update',function(msg){
    	if (this.clients[msg.clientId]) {
    		this.clients[msg.clientId] = msg.obj;
    	};	
    }.bind(this));

    this.socket.on('disconnection',function(msg){
    	if (!msg.host) {
    		alert("host disconnect, game restart!");
    		this.disconnect();
    	};
    	this.clients = msg.clients;
    	switch(this.clientState){
    		case game.stateList.startState:
    		case game.stateList.gameOverState:
    			this.refreshCountLabel();
    			break;
    		case game.stateList.gameState:
   				gameState.birds[msg.clientId].body.velocity.x = -200;
           		gameState.birds[msg.clientId].alive=false;
           		if (this.hostRight) {
           			var obj = {
                		'action' : "die",
                		'clientId' : msg.clientId
            		}
            		this.socket.emit('gameOperate',obj);
           		};
    	}
    }.bind(this));
}

Client.prototype.ping = function(){
	setTimeout(function(){
    	var time = Date.now();
    	this.socket.emit("ping",{"time":time});
    }.bind(this),3000)
}

Client.prototype.disconnect = function(){
	this.socket.disconnect();
	this.clients = {};	
	this.character = 0;
	this.id = null;
	this.clientIP = null;
	this.host = null;
	this.hostRight = false;
	game.state.start("chooseState");
	this.clientState = game.stateList.chooseState;
	clearTimeout(this.heartBeat);
	this.heartBeat = null;
}

Client.prototype.refreshCountLabel = function(){
	s = "";
	var i = getSize(this.clients);
	for (var k in this.clients){
		s += k + "\n ";
	};
	// document.getElementById('test').innerHTML = s 
	// document.getElementById('myId').innerHTML = "myId: " + this.id;
	if (this.clientState == game.stateList.startState) {
		startState.labelCount.text = "< Now have " + i + " clients waiting >";
		return;
	};
	if (this.clientState == game.stateList.gameOverState) {
		gameOverState.labelCount.text = "< Now have " + i + " clients waiting >";
		return;
	};
}