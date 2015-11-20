var loadState = {
	preload: function(){  
    // Change the background color of the game
    game.stage.backgroundColor = '#71c5cf';
    game.stage.disableVisibilityChange = true;
    game.onBlur.add(function(){
    	if(client&&client.clientState!=game.stateList.chooseState){
    		console.log("can not run on background");
    		client.disconnect();
    	}
    },loadState);
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
	this.scale.pageAlignVertically = true; 
	this.scale.pageAlignHorizontally = true;

    if(game.device.desktop === false){
    	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.startFullScreen();
    }
    
    // Load the bird sprite
	game.load.image('pipe', 'assets/paper.png');  
	game.load.image('menulogo', 'assets/logo.png');
	game.load.image('panel', 'assets/panel.png');
	game.load.image('gameBg', 'assets/gamebg.png');
	game.load.image('gameground','assets/gameground.png');

	game.load.spritesheet('startButton','assets/startButton.png',190,49);
	game.load.spritesheet('chooseButton','assets/chooseButton.png',190,49);
	game.load.spritesheet('characters','assets/charas.png',39,49);

	game.load.bitmapFont('fontSmall', 'assets/fonts/small/gameFont-small.png', 'assets/fonts/small/gameFont-small.xml');
	game.load.bitmapFont('fontLarge', 'assets/fonts/large/gameFont-large.png', 'assets/fonts/large/gameFont-large.xml');

},
	create: function() {
		game.state.start('chooseState');
	}

}
