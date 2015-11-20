var chooseState = {

	create: function() {
		this.character = false;
		this.namelist = [
			"Antony",
			"Sam",
			"Rob",
			"Chris N",
			"Sarunas",
			"Ting",
			"Jojo",
			"Chris G"
		];

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

	 	this.game.add.sprite(60,89,'panel');

	 	for (var i = 0; i < this.namelist.length; i++) {
	 		var x = 108 + (i%4) * 59;
	 		var y = 139 + Math.floor((i/4))*79
	 		this.addCharacter(i,x,y,this.namelist[i]);
	 	};

		this.startButton = game.add.button(105, 320, 'chooseButton',this.actionOnClick, this, 0, 0, 1);
	},

	actionOnClick: function(){
		client = new Client();
		client.character = this.character.tag;
	},

	addOneElement: function(group, x, y, speed) {  
	    // Get the first dead pipe of our group
	    var element = group.getFirstDead();
	    // Set the new position of the pipe
	    element.reset(x, y);
	    // Add velocity to the pipe to make it move left
	    element.body.velocity.x = speed; 
	    // Kill the pipe when it's no longer visible 
	    element.checkWorldBounds = true;
	    element.outOfBoundsKill = true;
	},

	addCharacter : function(i,x,y,name){
		var character = this.game.add.sprite(x,y,'characters',i);
	 	character.anchor.setTo(0.5,0.5);
	 	character.name = this.game.add.bitmapText(0,0,'fontSmall', name ,12);
	 	character.name.x = x - character.name.width/2;
	 	character.name.y = y + 25 + 10;
	 	character.tag = i;
	 	character.inputEnabled = true;
		character.events.onInputDown.add(this.mouseDown, this);
		if (i==0) {
			this.character = character;
			character.scale.setTo(1.2,1.2);
		};
	},

	mouseDown : function(sprite,pointer){
		if(sprite.tag != this.character.tag){
			game.add.tween(this.character.scale).to({x:1 , y:1}, 400, Phaser.Easing.Linear.None).start();
			game.add.tween(sprite.scale).to({x:1.2 , y:1.2}, 400, Phaser.Easing.Linear.None).start();
			this.character = sprite;
		}
	}
}

