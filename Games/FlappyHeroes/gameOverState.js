var gameOverState = {
	create: function() {
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

        this.highest = 0;
        this.bestStudent = [];
        this.findBest();
        game.add.bitmapText(140,154,"fontLarge","gameOver",20);
        this.heightLabel = game.add.bitmapText(140,173,"fontLarge","Best student got: " + this.highest ,20);
        this.heightLabel.x = 200 - this.heightLabel.width/2;

        for(var k in client.clients){
    		if (client.clients[k].score == this.highest) {
    			var x = 140 + this.bestStudent.length * 40;
    			var student = game.add.sprite(x,200,"characters",client.clients[k].char);
    			this.bestStudent.push(student);
    		};
    	};

    	for (var i = 0; i < this.bestStudent.length; i++) {
    		var width = 49 + 40 * (this.bestStudent.length - 1);
    		this.bestStudent[i].x = 200 - width/2 + 40 * i;
    	};

    	this.labelPing = game.add.bitmapText(330,20,"fontSmall","Ping: ",12);
		this.labelCount = game.add.bitmapText(109, 270, 'fontSmall',"now have "+ getSize(client.clients) +" clients waiting",12);
		this.labelCount.alpha = 0;
		game.add.tween(this.labelCount).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0, 100000, true);
		if (client.hostRight) {
			this.restartButton = game.add.button(105, 290, 'startButton',this.restartGame, this, 0, 0, 1);
		}else{
			this.labelWait = game.add.bitmapText(97, 285, 'fontSmall',"Please wait the host to restart",12);
			this.labelWait.alpha = 0;
			game.add.tween(this.labelWait).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0, 100000, true);
		}

       },
	
	restartGame: function() {
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

    findBest: function(){
    	for(var k in client.clients){
    		if (client.clients[k].score > this.highest) {
    			this.highest = client.clients[k].score;
    		};
    	}
    },

}