var Client = function(){
	this.socket = io({forceNew:true});;
	this.clients = {};	
	this.id = false;
	this.maxClient = 100;
	this.clientIP = false;
	this.host = false;
	this.hostRight = false;
	this.heartBeat = false;
	this.socket.on('getConnected',function(data){
		if (!data.accept) {
			this.socket.disconnect();
			alert("Game is running, please join later.");
			return;
		};
		if (!data.host) {
			this.socket.disconnect();
			alert("Please wait for host first before choosing a character.");
			return;
		};
		if (data.totalClients > this.maxClient){			
			this.socket.disconnect();
			alert("No more places, please try again later.");
			return;
		};
		if(!this.id){
			this.clientNumber = data.clientNumber;
			this.id = data.clientID;
			this.clientIP = data.clientIP;
			this.host = data.host;
			this.totalClients = data.totalClients
			if(data.host == this.id){
				this.hostRight = true;
			}
			console.log("My id: "+ this.id + ", Host: " + this.host);
		}
		initClient();
	}.bind(this));
	
	this.socket.on('updatedInfo', function(data){
		this.id = data.clientID;
		this.clientIP = data.clientIP;
		this.host = data.host;
		this.totalClients = data.totalClients
	}.bind(this));
	
	this.socket.on('accepted',function(data){
		this.clients = data.clients;
		resetLog();
		for (var k in this.clients){
			var client = this.clients[k];
			var name = client.name;
			updateLog(k,name);
		}
	}.bind(this));
	
	this.socket.on('gameOperate', function(data){
		switch(data.action){
			case "shuffle":
				shuffle();
				break;
			case "deal":
				deal();
				break;
			case "updateCards":
				updateCards(data.cards);
				break;
			case "getInfo":
				client.socket.emit('getInfo');
				break;
			case "addCardToPile":
				addPile();
				break;
			case "failureSnap":
				failureSnap(data.playerNumber);
				break;
			case "successSnap":
				successSnap(data.playerNumber, data.timeTaken);
				break;
			case "reset":
				reset();
				break;
			}
		}.bind(this));
		
		
	this.socket.on('changeState', function(data){
		switch(data.state){
			case "1":
				init(data.time);
				break;
			}
		}.bind(this));
}