var startState = {
	create: function(){
		this.game.add.sprite(0,0,'map',1);
		this.record1 = this.game.add.sprite(59,180,'recordButton');
		this.record2 = this.game.add.sprite(59,340,'recordButton');
		if(storageSys.status != true){
			this.game.add.bitmapText(40,100,"luminari-dark","Your browser does not support game save.",20);
		}else{
			this.records = storageSys.readRecord();
		};

		if (!storageSys || !this.records[0]) {
			this.game.add.bitmapText(185,230,"luminari-title","New Record",22);
			this.record1.tag = 1;
			this.record1.inputEnabled = true;
			this.record1.events.onInputDown.add(this.actionToNew, this);
		}else{
			var name = this.records[0].name;
			if (name.length > 8) {
				name = name.substr(0,7) + "...";
			};
			var record = this.game.add.bitmapText(185,230,"luminari-title","Record:" + name,22);
			record.x = 240 - record.width/2
			this.record1.inputEnabled = true;
			this.record1.events.onInputDown.add(function(){
				storageSys.setRecord(1);
				this.actionToGame(this.records[0])
			}, this);
		}

		if (!storageSys || !this.records[1]) {
			this.game.add.bitmapText(185,390,"luminari-title","New Record",22);
			this.record2.tag = 2;
			this.record2.inputEnabled = true;
			this.record2.events.onInputDown.add(this.actionToNew, this);
		}else{
			var name = this.records[1].name;
			if (name.length > 8) {
				name = name.substr(0,7) + "...";
			};
			var record = this.game.add.bitmapText(185,390,"luminari-title","Record:" + name,22);
			record.x = 240 - record.width/2
			this.record2.inputEnabled = true;
			this.record2.events.onInputDown.add(function(){
				storageSys.setRecord(2);
				this.actionToGame(this.records[1])
			}, this);
		};
	},

	actionToNew:function(sprite,pointer){
		enterFx.play();
		storageSys.setRecord(sprite.tag);
		game.state.start("nameState");
	},

	actionToGame:function(obj){
		enterFx.play();
		client = new Client(obj,false);
	}
}

var waitState = {
	create: function(){
		client.socket.emit("accept",client.clientInfo);
		this.game.add.sprite(0,0,'map',1);
		this.game.add.sprite(80,173,'dialog',0);
		this.game.add.bitmapText(100,182,"luminari-white","Waiting List" + name,20);
		this.clientGroup = this.game.add.group();
		if(client.hostRight){
			//console.log("host");
			this.game.add.button(328, 543 , 'startText',this.actionOnClick, this, 1,0,2);
		}
	},

	refreshList : function(){
		var i = 0;
		this.clientGroup.removeAll();
		for (var k in client.clients){
			var c = client.clients[k];
			this.clientGroup.add(this.game.add.sprite(80,230 + i*60,'dialog',1));
			var head = this.game.add.sprite(130,220 + i*60,'charasHead', c.job);
			head.scale.x = -1;
			this.clientGroup.add(head);
			this.clientGroup.add(this.game.add.bitmapText(150,240 + i*60 ,"luminari-white", c.name, 20));
			this.clientGroup.add(this.game.add.bitmapText(320,240 + i*60 ,"luminari-white", "Lv: " + c.level, 20));
			i++;
		}
	},

	actionOnClick : function(){
		if(client.hostRight){
			var msg = {
				"state" : game.stateList.mapState
			}
			client.socket.emit("changeState",msg);
			client.socket.emit("serverClose");
		}
	}
}

var nameState = {
	create:function(){
		this.game.add.sprite(0,0,'map',1);
		this.game.add.sprite(81,264,'namePanel');
		this.game.add.button(360, 318 , 'arrow',this.actionOnClick, this, 1,1,1);
		document.getElementById("nameDiv").style.visibility="visible";
		document.getElementById("nameDiv").value=chance.first();
	},

	actionOnClick:function(){
		var name = document.getElementById("nameDiv").value;
		game.state.start("chooseState",true,false,name);
		document.getElementById("nameDiv").style.visibility="hidden";
		document.getElementById("nameDiv").value="";

	}
}

var mapState = {
	create : function(){
		this.game.add.sprite(0,0,'map',0);
		this.game.add.button(305, 514 , 'sunsetButton',this.actionOnClick, this, 1,0,2);
	},
	actionOnClick:function(){
		if(client.hostRight){
			var msg = {
				"state" : game.stateList.gameState
			}
			client.socket.emit("changeState",msg);
		}
	}
}