var Character = function(charaJob,level,name,exp){
	
	this.job = charaJob;
	this.level = level;
	this.name = name; 
	this.exp = exp;
	this.health;
	

	this.physicAttack;
	this.magicAttack;
	this.heal;
	this.goalExp;

	this.healthRate;
	this.physicRate;
	this.magicRate;
	this.healRate;

	this.head;
	this.levelTag;
	this.expBar;

	switch (this.job){
		case Character.JOB_CODE.WARRIOR :
			this.healthRate = 2;
			this.physicRate = 2;
			this.magicRate 	= 0.5;
			this.healRate 	= 0.1; 
			break;
		case Character.JOB_CODE.PRIEST:
			this.healthRate = 1;
			this.physicRate = 0.5;
			this.magicRate	= 0.5;
			this.healRate 	= 2; 
			break;
		case Character.JOB_CODE.WIZARD:
			this.healthRate = 0.6;
			this.physicRate = 0.5;
			this.magicRate 	= 4;
			this.healRate 	= 0.2; 
		default:
			
	}
	
	this.gainExp = function(gained){
		this.exp += gained;
		if (this.exp >= this.goalExp) {
			this.levelUP();
			return;
		};
		if (this.expBar) {
			game.add.tween(this.expBar.scale).to({x:(this.exp/this.goalExp) * 0.7}, 1200, Phaser.Easing.Quadratic.InOut).start();
		};
	};

	this.levelUP = function(){
		this.level ++;
		this.exp = 0;
		var oldHealth = this.health;
		if (this.expBar) {
			game.add.tween(this.expBar.scale).to({x:0}, 1200, Phaser.Easing.Quadratic.InOut).start();
		};
		if (this.levelTag) {
			this.levelTag.text = "Lv:" + this.level;
		};
		this.refreshProperty();
		var increaseHealth = this.health - oldHealth;
		gameState.currentHealth += increaseHealth;
		gameState.totalHealth += increaseHealth;
		gameState.refreshHealth();
	};

	this.refreshProperty = function(){
		this.health 		= this.healthRate * ((this.level - 1) * 40 + Character.BASE_HEALTH);
		this.physicAttack 	= this.physicRate * ((this.level - 1) * 5 + Character.BASE_PHYSIC);
		this.magicAttack 	= this.magicRate * ((this.level - 1)* 5 + Character.BASE_MAGIC);
		this.heal 			= this.healRate * ((this.level -1) * 5 + Character.BASE_HEAL);
		this.goalExp 		= Character.BASE_EXP + (this.level - 1) * 40;
	};

	this.pAttack = function(size){
		var damage = Math.floor(this.physicAttack * (Math.random()* 0.5 + 0.7) * size / 2);
		return damage;
	}

	this.mAttack = function(size){
		var damage = Math.floor(this.magicAttack * (Math.random()* 0.5 + 0.7) * size / 2);
		return damage;
	}

	this.healAmount = function(size){
		var healAmount = Math.floor(this.heal * (Math.random()* 0.5 + 0.7) * size / 2);
		return healAmount;
	}

	this.refreshProperty();
	//console.log("init with Character: " + this.job );
	//console.log(this.health);
	//console.log(this.level);

} 

Character.JOB_CODE = {
	"WARRIOR" : 0,
	"PRIEST"  : 1,
	"WIZARD"  : 2
 }

Character.BASE_HEALTH	= 100;
Character.BASE_PHYSIC 	= 10;
Character.BASE_MAGIC 	= 10;
Character.BASE_HEAL 	= 10;
Character.BASE_EXP 		= 50;
