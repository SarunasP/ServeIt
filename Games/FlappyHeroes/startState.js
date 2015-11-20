var startState = {
	create: function() { 
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		this.background1 = game.add.group();
        this.background1.enableBody = true; 
        this.background1.createMultiple(3, 'gameBg');
        this.addOneElement(this.background1,0,0,-20);
        this.addOneElement(this.background1,400,0,-20);

        this.background1Timer = game.time.create(false);
        this.background1Timer.loop(19990, function(){
            this.addOneElement(this.background1,400,0,-20);
        }, this);
        this.background1Timer.start();

        
        this.background2 = game.add.group();
        this.background2.enableBody = true; 
        this.background2.createMultiple(3, 'gameground');
        this.addOneElement(this.background2,0,434,-100);
        this.addOneElement(this.background2,400,434,-100);
        this.background2Timer = game.time.create(false);
        this.background2Timer.loop(3990, function(){
            this.addOneElement(this.background2,400,434,-100);
        }, this);
        this.background2Timer.start();

		this.emitter = game.add.emitter(0, -10 , 200);
		this.emitter.width = 800;
		this.emitter.makeParticles('pipe');
		this.emitter.minParticleScale = 0.5;
    	this.emitter.maxParticleScale = 1;
    	this.emitter.gravity = 150;
	 	this.emitter.start(false, 5000, 300);



		this.game.add.sprite(90, 111,'menulogo');

		this.labelPing = game.add.bitmapText(330,20,"fontSmall","Ping: ",12);
		this.labelCount = game.add.bitmapText(109, 220, 'fontSmall',"",12);
		this.labelCount.alpha = 0;
		game.add.tween(this.labelCount).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0, 100000, true);
		if (client.hostRight) {
			this.startButton = game.add.button(105, 290, 'startButton',this.actionOnClick, this, 0, 0, 1);
		}else{
			this.labelCount.y = 250
			this.labelWait = game.add.bitmapText(102, 265, 'fontSmall',"Please wait the host to start",12);
			this.labelWait.alpha = 0;
			game.add.tween(this.labelWait).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0, 100000, true);
		};
		sendClient = {
			"char" : client.character,
			"score" : 0
		}
		client.socket.emit("accept",sendClient);
	},
	
	actionOnClick: function() {
		if(client.hostRight){
			var d = new Date();
			var msg = {
				"state" : game.stateList.gameState,
				"timeStamp" : d
			}
			client.socket.emit("changeState",msg);
			client.socket.emit("serverClose");
		}		
	},

	addOneElement: function(group, x, y, speed) {  
	    var element = group.getFirstDead();
	    element.reset(x, y);
	    element.body.velocity.x = speed; 
	    element.checkWorldBounds = true;
	    element.outOfBoundsKill = true;
	},
}
