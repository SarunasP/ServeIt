
var Client = function(){
	this.socket = io({forceNew:true});;
	this.clients = {};	
	this.id = false;
	this.maxClient = 100;
	this.clientIP = false;
	this.host = false;
	this.hostRight = false;
	this.heartBeat = false;
	this.timeArray = [[]];
	this.numClients = 0;
	this.socket.on('getConnected',function(data){
		if (!data.accept) {
			this.socket.disconnect();
			alert("Game is running, please join later.");
			return;
		};
		if (!data.host) {
			this.socket.disconnect();
			alert("Please wait for host first before entering your name.");
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
		this.numClients = 0;
		for (var k in this.clients){
			var client = this.clients[k];
			var name = client.name;
			updateLog(name);
			this.numClients++;
		}
	}.bind(this));
	
	this.socket.on('disconnection', function(data){
		this.clients = data.clients;
		resetLog();
		for (var k in this.clients){
			var client = this.clients[k];
			var name = client.name;
			updateLog(name);
		}
		this.numClients--;
	}.bind(this));
	
	// this.socket.on('gameOperate', function(data){
		// switch(data.action){
			// case "submitTime":
			
				// console.log("Client " + data.clientNumber + " has submitted time " + data.reactionTime);
				
				// if(this.timeArray.length == 0){
					// this.timeArray.push(0, 0);
				// }
				
				// var pushingValue = {};
				// pushingValue.clientNumber = data.clientNumber;
				// pushingValue.timeTaken = data.reactionTime;
				// this.timeArray.push(pushingValue);
				
				// if((this.timeArray.length-1) == this.numClients){
				
					// var minimumValue = 0;
					// var minimumClient = 0;
					
					// for(var k = 1; k < this.timeArray.length; k++){
						// if(this.timeArray[k].timeTaken < minimumValue || minimumValue == 0){
							// minimumValue = this.timeArray[k].timeTaken;
							// minimumClient = this.timeArray[k].clientNumber;
						// }
					// }
		
					// displayWinner(minimumValue, minimumClient);
					// this.timeArray = [[]];
				// }
				// break;
				
			// }
		// }.bind(this));
		
	this.socket.on('submitTime',function(data){
	console.log("Client " + data.clientNumber + " has submitted time " + data.reactionTime);
				
				if(this.timeArray.length == 0){
					this.timeArray.push(0, 0);
				}
				
				var pushingValue = {};
				pushingValue.clientNumber = data.clientNumber;
				pushingValue.timeTaken = data.reactionTime;
				this.timeArray.push(pushingValue);
				
				if((this.timeArray.length-1) == this.numClients){
				
					var minimumValue = 0;
					var minimumClient = 0;
					
					for(var k = 1; k < this.timeArray.length; k++){
						if(this.timeArray[k].timeTaken < minimumValue || minimumValue == 0){
							minimumValue = this.timeArray[k].timeTaken;
							minimumClient = this.timeArray[k].clientNumber;
						}
					}
		
					displayWinner(minimumValue, minimumClient);
					this.timeArray = [[]];
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