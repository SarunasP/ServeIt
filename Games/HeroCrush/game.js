var game = new Phaser.Game(480, 720, Phaser.AUTO, '');
var storageSys = new StorageSystem();
var client;
game.state.add('loadState', loadState); 
game.state.add('gameState',gameState);
game.state.add('coverState',coverState);
game.state.add('chooseState',chooseState);
game.state.add('startState',startState);
game.state.add('nameState',nameState);
game.state.add('waitState',waitState);
game.state.add('mapState',mapState);
game.state.start('loadState');

game.stateList = {
	"startState" : 0,
	"waitState"  : 1,
	"mapState" 	 : 2,
	"gameState"  : 3
}


// socket.on('getConnected',function(data){
// 	if(!id){
// 		id = data.clientID;
// 	}
// 	game.state.start('chooseState');
// 	//if(data.gameState==0){
// 	//	game.state.start('loadState');
// 	//}
// });


