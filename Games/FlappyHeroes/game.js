var game = new Phaser.Game(400, 490, Phaser.AUTO, '');
// var socket;
var client;
// var clients = {};
// var character = false;
// var id = false;
// var timeStamp;
// var maxClient = 2;
// var clientIP = false;
// var host = false;

game.state.add('loadState', loadState);  
game.state.add('startState', startState);
game.state.add('gameState', gameState);
game.state.add('chooseState',chooseState);
game.state.add('gameOverState',gameOverState);
game.state.start('loadState');

game.stateList = {
	"startState" : 0,
	"gameState" : 1,
	"chooseState" : 2,
	"gameOverState" : 3,
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

function getSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

