var coverState = {
	create : function(){
		this.game.add.sprite(0,0,'cover');
		this.tag = this.game.add.sprite(170,560,'tag');
		this.tag.alpha = 0;
		this.game.add.tween(this.tag).to( {alpha:1} , 2000,Phaser.Easing.Quadratic.InOut, false, 0, 100000, true).start();
		this.game.input.onDown.add(function(){
			enterFx.play();
			game.state.start('startState');
		});
		bgm.loop = true;
        bgm.play();
	},
}