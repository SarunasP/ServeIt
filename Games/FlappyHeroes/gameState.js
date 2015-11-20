var gameState = {
	create: function() {
        Math.seedrandom(client.timeStamp);
        this.birds = {}; 
        this.gameover = false;  
        this.paused = false;
        this.score = 0;
        this.count = 3; 
        this.run = true; 

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);


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


        //...
        this.labelCount = game.add.text(200, 240, this.count, { font: "25px Arial", fill: "#ffffff" }); 
        this.labelCount.anchor.setTo(0.5,0.5)    
        this.counttimer = game.time.events.repeat(1000,3,this.countDown,this);

        this.pipes = game.add.group(); 
        this.pipes.enableBody = true;   
        this.pipes.createMultiple(15, 'pipe'); 
        this.pipeTimer = game.time.create(false);
        this.pipeTimer.loop(1500, this.addRowOfPipes, this);
        this.pipeTimer.start();

        this.labelScore = game.add.bitmapText(20,20, "fontSmall", "Mark: 0", 12);   
        this.labelAlive = game.add.bitmapText(20,35, "fontSmall", "Alive: 0 ", 12);
        this.labelPing = game.add.bitmapText(330,20,"fontSmall","Ping: ",12);
        
        for (var k in client.clients){
            if (client.clients.hasOwnProperty(k)) {
                var tag = client.clients[k].char;
                this.birds[k] = this.game.add.sprite(100,245,'characters',tag);
                this.birds[k].anchor.setTo(-0.2,0.5);
                game.physics.arcade.enable(this.birds[k]);
                this.birds[k].body.gravity.y = 1000;
                if (k!=client.id) {
                    this.birds[k].alpha = 0.4;
                };
            }
        }
        this.birds[client.id].bringToTop();
        this.labelAlive.text = "Alive: " + getSize(this.birds); 
        this.game.input.onDown.add(function(){
            if (this.paused) return;
            var obj = {
                'action' : "jump",
                'clientId' : client.id,
            };

            client.socket.emit('gameOperate',obj);
        }, this);
        this.score = -1;   
        this.gamePause();	
    },

    update: function() {  
        for (var k in this.birds){   
            if (this.paused) break;
            if (this.birds[k].angle < 20) {
                this.birds[k].angle += 1;
            }
            if (this.birds[k].alive&&this.birds[k].body.y<=0){
                this.birds[k].body.y = 0;
            }
        }
        game.physics.arcade.overlap(this.birds[client.id], this.pipes, this.hitPipe, null, this); 
         // If the bird is out of the world (too high or too low), call the 'restartGame' function
        if (this.gameover == false && this.birds[client.id].inWorld == false) {
            this.gameover = true;
            var obj = {
                'action' : "die",
                'clientId' : client.id
            }
            client.socket.emit('gameOperate',obj);
            var updateClient = {
                "clientId" : client.id,
                "obj" : {
                        "char" : client.character,
                        "score" : this.score
                        }
            }
            client.socket.emit("update",updateClient);
        }
    },

    jump: function(k){ 
        if (!this.birds[k] || this.birds[k].alive == false)return;
        var animation = game.add.tween(this.birds[k]);
        animation.to({angle: -20}, 100);
        animation.start();  
        this.birds[k].body.velocity.y = -350;
    },

    addOneElement: function(group, x, y, speed) {  
        var element = group.getFirstDead();
        element.reset(x, y);
        element.body.velocity.x = speed; 
        element.checkWorldBounds = true;
        element.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {   
        if(this.birds[client.id]&&this.birds[client.id].alive){
            this.score += 1; 
            this.labelScore.text = "Mark: " + this.score;  
        } 
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++){
            if (i != hole && i != hole + 1)
                this.addOneElement(this.pipes, 400, i * 60 + 10, -200);   
        }
    },

    hitPipe: function() {  
        if (this.birds[client.id].alive){
            var obj = {
                'action' : "hitPipe",
                'clientId' : client.id
             }
            this.birds[client.id].alive = false;
            client.socket.emit('gameOperate',obj);
        }
    },

    die: function(k){
        delete this.birds[k];
        this.labelAlive.text = "Alive: " + getSize(this.birds); 
        if (client.hostRight) {
            if(getSize(this.birds)==0){
                client.socket.emit("changeState",{"state" : game.stateList.gameOverState});
                client.socket.emit("serverOpen");
            }
        };
    },

    gamePause: function() {
        this.paused = true;
        for (var k in this.birds){
            if (this.birds.hasOwnProperty(k)) {
                this.birds[k].body.gravity.y = 0;
                this.pipeTimer.pause();
            }
        }
    },

    gameRestrat: function(){
        this.paused = false;
        for (var k in this.birds){
            if (this.birds.hasOwnProperty(k)) {
                this.birds[k].body.gravity.y = 1000;
                this.pipeTimer.resume();
            }
        }
    },

    countDown: function(){
        this.count--;
        this.labelCount.text = this.count;
        if(this.count == 0){
            this.labelCount.text = "Go";
            this.game.add.tween(this.labelCount).to({ alpha: 0}, 800, Phaser.Easing.Linear.None).start();
            this.game.add.tween(this.labelCount.scale).to({x: 2, y: 2},800, Phaser.Easing.Linear.None).start();
            game.time.events.add(800,function(){
                game.world.remove(this.labelCount);
                this.gameRestrat();
            },this);
        }
    }
}