var chooseState = {
	init: function(name){
		this.name = name;
	},
	create : function(){
		this.startButton;
		this.choosedJob;
		this.game.add.sprite(0,0,'background');
		this.loadChara();
	},

	loadChara : function(){
		for (var i = 0; i < 3; i++) {
			var job = this.game.add.sprite(0,240*i,'charas',i);
			job.job = i;
			job.alpha = 0.6;
			job.inputEnabled = true;
			job.events.onInputDown.add(this.mouseDown, this);
			if(i==0){
				job.alpha = 1;
				this.choosedJob = job;
				this.startButton = this.game.add.button(192, 72 , 'startButton',this.actionOnClick, this, 1, 0, 2);
			}
		}
	},

	mouseDown : function(sprite, pointer){
		selectFx.play();
		if (sprite!=this.choosedJob) {
			this.setChoose(sprite);
		};
	},

	setChoose : function(sprite){
		this.game.add.tween(sprite).to({alpha:1},500,Phaser.Easing.Quadratic.InOut).start();
		this.game.add.tween(this.choosedJob).to({alpha:0.6},500,Phaser.Easing.Quadratic.InOut).start();
		this.choosedJob = sprite;
		this.startButton.y = 72 + sprite.job * 240;
		this.startButton.bringToTop();
	},

	actionOnClick : function(){
		enterFx.play();
		var obj = {
			"name" : this.name,
			"job" : this.choosedJob.job,
			"level" : 1,
			"exp" : 0
		}
		storageSys.saveProgress(obj);
		game.state.start("startState");
	}
}