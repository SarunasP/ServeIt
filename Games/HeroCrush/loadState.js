var loadState = {
	preload: function(){  
    
    game.stage.disableVisibilityChange = true;
    game.scale.setMinMax(320,480);

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
	this.scale.pageAlignVertically = true; 
	this.scale.pageAlignHorizontally = true;

    game.load.spritesheet('box','assets/spritesheet/box.png',54,54);
    game.load.spritesheet('star','assets/spritesheet/star.png',21,21);
    game.load.spritesheet('rabbit','assets/spritesheet/rabbit.png',237,237);
    game.load.spritesheet('startButton','assets/spritesheet/startButton.png',96,96);
    game.load.spritesheet('box','assets/spritesheet/box.png',54,54);
    game.load.spritesheet('charas','assets/spritesheet/charas.png',480,240);
    game.load.spritesheet('charasHead','assets/spritesheet/charasHead.png',53,53);
    game.load.spritesheet('map','assets/spritesheet/map.png',480,720);
    game.load.spritesheet('arrow','assets/spritesheet/arrow.png',22,21);
    game.load.spritesheet('dialog','assets/spritesheet/dialogBg.png',320,41);
    game.load.spritesheet('startText','assets/spritesheet/start.png',70,50);
    game.load.spritesheet('sunsetButton','assets/spritesheet/mapButton.png',70,50);
    game.load.spritesheet('personBar','assets/spritesheet/player_health.png',125,10);

    game.load.image('cover','assets/img/startPage.png');
    game.load.image('tag','assets/img/tag.png');
    game.load.image('background','assets/img/background.png');
    game.load.image('diamond','assets/img/diamond.png');
    game.load.image('stroke','assets/img/back1.png');
    game.load.image('iconBack','assets/img/back2.png');
    game.load.image('monsterBack','assets/img/monsterBack.png');
    game.load.image('monsterBar','assets/img/monster_health.png');
    game.load.image('recordButton','assets/img/recordButton.png');
    game.load.image('namePanel','assets/img/namePanel.png');
    game.load.image('leaveButton','assets/img/leaveButton.png');
    game.load.image('gameOver','assets/img/gameOver.png');

    game.load.audio('bgm','assets/se/music/bgm.mp3');
    game.load.audio('remove', 'assets/se/remove.wav');
    game.load.audio('select', 'assets/se/select.wav');
    game.load.audio('hurt','assets/se/hurt.wav');
    game.load.audio('bunnyHurt','assets/se/bunnyHurt.wav');
    game.load.audio('bunnyAttack','assets/se/bunnyAttack.wav');
    game.load.audio('removeMulti','assets/se/removeMulti.wav');
    game.load.audio('enter','assets/se/enter.wav');

    game.load.bitmapFont('luminari-white', 'assets/fonts/luminari-white/luminari-white.png', 'assets/fonts/luminari-white/luminari-white.xml');
    game.load.bitmapFont('luminari-dark', 'assets/fonts/luminari-dark/luminari-dark.png', 'assets/fonts/luminari-dark/luminari-dark.xml');
    game.load.bitmapFont('luminari-title', 'assets/fonts/luminari-title/luminari-title.png', 'assets/fonts/luminari-title/luminari-title.xml');
    game.load.bitmapFont('luminari-yellow', 'assets/fonts/luminari-yellow/luminari-yellow.png', 'assets/fonts/luminari-yellow/luminari-yellow.xml');
    game.load.bitmapFont('luminari-pink', 'assets/fonts/luminari-pink/luminari-pink.png', 'assets/fonts/luminari-pink/luminari-pink.xml');
    game.load.bitmapFont('luminari-green', 'assets/fonts/luminari-green/luminari-green.png', 'assets/fonts/luminari-green/luminari-green.xml');
    game.load.bitmapFont('luminari-red', 'assets/fonts/luminari-red/luminari-red.png', 'assets/fonts/luminari-red/luminari-red.xml');
    enterFx = this.game.add.audio('enter');
    bgm = this.game.add.audio('bgm');
    selectFx = this.game.add.audio('select');
    },
	create: function() {
		game.state.start('coverState');
	}

}