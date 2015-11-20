// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {

preload: function(){  
    // Change the background color of the game
    game.stage.backgroundColor = '#71c5cf';

    // Load the bird sprite
    game.load.image('bird', 'assets/bird.png'); 
	
	game.load.image('pipe', 'assets/pipe.png');  
},

create: function() {   

this.score = 0;  
this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  

this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);  

this.pipes = game.add.group(); // Create a group  
this.pipes.enableBody = true;  // Add physics to the group  
this.pipes.createMultiple(20, 'pipe'); // Create 20 pipes  

    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the bird on the screen
    this.bird = this.game.add.sprite(100, 245, 'bird');
	this.bird.anchor.setTo(-0.2, 0.5); 

    // Add gravity to the bird to make it fall
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;  

    // Call the 'jump' function when the spacekey is hit
    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);  

this.score = -1;  
this.labelScore.text = 0;  
	
},

update: function() {  

if (this.bird.angle < 20)  
    this.bird.angle += 1;

game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 

    // If the bird is out of the world (too high or too low), call the 'restartGame' function
    if (this.bird.inWorld == false)
        this.restartGame();
},

// Make the bird jump 
jump: function(){ 


if (this.bird.alive == false)  
    return; 

// Create an animation on the bird
var animation = game.add.tween(this.bird);

// Set the animation to change the angle of the sprite to -20° in 100 milliseconds
animation.to({angle: -20}, 100);

// And start the animation
animation.start();  


if (this.bird.alive == false)  
    return; 
	
    // Add a vertical velocity to the bird
    this.bird.body.velocity.y = -350;
},

// Restart the game
restartGame: function() {  
    // Start the 'main' state, which restarts the game
    game.state.start('main');
},

addOnePipe: function(x, y) {  
    // Get the first dead pipe of our group
    var pipe = this.pipes.getFirstDead();

    // Set the new position of the pipe
    pipe.reset(x, y);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200; 

    // Kill the pipe when it's no longer visible 
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
},

addRowOfPipes: function() {  
this.score += 1;  
this.labelScore.text = this.score;  

    // Pick where the hole will be
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes 
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1) 
            this.addOnePipe(400, i * 60 + 10);   
},

hitPipe: function() {  
    // If the bird has already hit a pipe, we have nothing to do
    if (this.bird.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEachAlive(function(p){
        p.body.velocity.x = 0;
    }, this);
},

};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main');  