var Monster = function(monsterID){

	this.monsterData = monsterData[monsterID];
	this.monsterName = this.monsterData.name;
	this.monsterLv = this.monsterData.level;
	this.hpRate = this.monsterData.hpRate;
	this.damageRate = this.monsterData.damageRate;
	this.monsterStatus = "normal";
	this.maxhealth = this.monsterLv * 100 + this.hpRate * Monster.BASE_HEALTH;
	this.health = this.maxhealth;
	this.alive = true;
	this.damage =(this.monsterLv - 1) * 8 + this.damageRate * Monster.BASE_DAMAGE;
	//console.log(this.damage);
	this.body = game.add.sprite(240,165,this.monsterData.spritesheet);
	this.body.anchor.setTo(0.5,0.5);
	this.addAnim('normal');
	this.addAnim('attack');
	this.addAnim('hurt');
	this.body.animations.play('normal');

	this.hpBar = game.add.sprite(40,40,'monsterBar');
	this.nameLabel = game.add.bitmapText(180, 15, 'luminari-dark',this.monsterName,20);

	this.attackFx = game.add.audio(this.monsterData.attackFx);
	this.hurtFx = game.add.audio(this.monsterData.hurtFx);	
	
}

Monster.prototype.addAnim = function(animName){
	var frames = [];
	var anim = this.monsterData[animName];
	var fps = anim[2];
	for (var i = anim[0]; i<= anim[1]; i++) {
		frames.push(i);
	};
	this.body.animations.add(animName,frames,fps,true);
}

Monster.prototype.attacked = function(damage){
	if (this.alive) {
		if (this.monsterStatus!= "attack"){
			this.health = this.health - damage;
			game.add.tween(this.hpBar.scale).to({x:this.health/this.maxhealth}, 1200, Phaser.Easing.Quadratic.InOut).start();
			//this.hpBar.width = Monster.HP_WIDTH * this.health/this.maxhealth;
		}
		if(this.health<=0){
			this.die();
		}
		if (this.monsterStatus == "normal") {
			this.hurtFx.play();
			this.body.animations.play('hurt');
			this.monsterStatus = "hurt";
			game.time.events.add(500,function(){
				if(this.monsterStatus == "hurt"){
					this.body.animations.play('normal');
					this.monsterStatus = "normal";
				}
			},this);
		};

	};
}

Monster.prototype.attack = function(attackTime){
	if (this.alive) {
		game.input.enabled = false;
		this.monsterStatus = "attack";
		this.body.scale.setTo(1.3,1.3);
		this.body.animations.play('attack');
		this.attackFx.play();
		game.time.events.add(1200*attackTime,function(){
			game.input.enabled = true;
			this.body.animations.play('normal');
			this.monsterStatus = "normal";
			this.body.scale.setTo(1,1);		
		},this);
	}
}

Monster.prototype.getDamage = function(attackTime){
	var monsterDamage = Math.floor((Math.random() * 0.6 + 0.6) * this.damage) * attackTime;
	return monsterDamage;
}

Monster.prototype.die = function(){
	this.alive = false;
	game.add.tween(this.body).to({alpha:0}, 1000, Phaser.Easing.Quadratic.InOut).start();
	game.add.tween(this.nameLabel).to({alpha:0}, 1000, Phaser.Easing.Quadratic.InOut).start();
	game.add.tween(this.hpBar).to({alpha:0}, 1000, Phaser.Easing.Quadratic.InOut).start();
	game.time.events.add(1000,function(){
		game.world.remove(this.body);
		game.world.remove(this.hpBar);
		game.world.remove(this.nameLabel);
		game.world.remove(this.hurtFx);
		game.world.remove(this.attackFx);
	},this);
}

Monster.prototype.giveExp = function(size){
	var exp = Math.floor(this.monsterLv * 2 + size *  (Math.random()*10 + 10)/2);
	return exp;
}

Monster.prototype.setMonsterLevel = function(level){
    this.monsterLv = level;
    this.maxhealth = this.monsterLv * 100 + this.hpRate * Monster.BASE_HEALTH;
    this.health = this.maxhealth;
    this.damage = (this.monsterLv - 1) * 5 +  this.damageRate * Monster.BASE_DAMAGE;
}

Monster.BASE_HEALTH = 1000;
Monster.BASE_DAMAGE = 15;
Monster.HP_WIDTH = 400;
