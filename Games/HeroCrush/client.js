var Client = function (obj) {
    //console.log("create new");
    this.gameState = game.stateList.startState;
    this.clientInfo = obj;
    this.socket = io({forceNew: true});
    this.clients = {};
    this.id = null;
    this.clientIP = null;
    this.host = null;
    this.hostRight = null;

    this.socket.on('getConnected', function (data) {
        if (!data.accept && !data.reconnect) {
            this.socket.disconnect();
            alert("Game is running, please join later.");
            return;
        }

        if (data.host == null) {
            this.socket.disconnect();
            alert("Please wait for host first");
            return;
        }
        if (data.totalClients > data.maxClient) {
            this.socket.disconnect();
            alert("No more place, please try later.");
            return;
        }
        if (this.id == null) {
            this.id = data.clientID;
            this.clientIP = data.clientIP;
            this.host = data.host;
            if (data.host == this.id) {
                this.hostRight = true;
            }
            //console.log("My id: " + this.id + ", Host: " + this.host);
        }
        //call back;
        game.state.start("waitState");
        this.gameState = game.stateList.waitState;
    }.bind(this));


    this.socket.on("accepted", function (data) {
        this.clients = data.clients;
        waitState.refreshList();
    }.bind(this));


    this.socket.on("changeState", function (data) {
        this.gameState = data.state;

        //call back;
        switch (data.state) {
            case game.stateList.mapState:
                game.state.start("mapState");
                break;
            case game.stateList.gameState:
                game.state.start("gameState");
                break;
        }
    }.bind(this));

    this.socket.on('monsterAttack', function (data) {
        gameState.monsterAttack(data.attackTime, data.damage);
    }.bind(this));

    this.socket.on('physicAttack', function (data) {
        gameState.pattackMonster(data.damage, data.clientId);
    }.bind(this));

    this.socket.on('healTeam', function (data) {
        gameState.healTeam(data.heal, data.clientId);
    }.bind(this));

    this.socket.on('magicAttack', function (data) {
        gameState.mattackMonster(data.damage, data.clientId);
    }.bind(this));

    this.socket.on('gainExp', function (data) {
        gameState.gainExp(data.exp, data.clientId);
    }.bind(this));

    this.socket.on('update', function (data) {
        this.clients = data.clients;
    }.bind(this));

    this.socket.on('setMonsterLevel',function(data){
        gameState.setMonsterLevel(data.level);
    });

    this.socket.on('gameOver', function (data) {
        gameState.gameOver();
        this.gameState = game.stateList.waitState;
        if(this.hostRight){
            this.socket.emit("serverOpen");
        }
    }.bind(this));

    this.socket.on('disconnection', function (data) {
        if (!data.host) {
            alert("host disconnect, game restart!");
            this.disconnect();
        }
        this.clients = data.clients;
        switch (this.gameState) {
            case game.stateList.waitState:
                waitState.refreshList();
                break;
            case game.stateList.gameState:
                gameState.loadTeammate();
                break;
        }
    }.bind(this));
}

Client.prototype.disconnect = function () {
    this.socket.disconnect();
    this.clients = {};
    this.clientInfo = null;
    this.id = null;
    this.clientIP = null;
    this.host = null;
    this.hostRight = false;
    game.state.start("startState");
    this.gameState = game.stateList.startState;
}