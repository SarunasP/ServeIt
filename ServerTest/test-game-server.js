var should = require('should');
var server = require('../socket.js');
var io = require('socket.io/node_modules/socket.io-client');
var socketURL = 'http://0.0.0.0:3000';

var options = {
    'force new connection': true
};

var getConnected_struct = {
    "accept": "Boolean",
    "totalClients": "Number",
    "host": "String",
    "clientID": "String",
    "clientIP": "String"
};

var accept_json = {
    "client_info_number": 1,
    "client_info_string": "string"
};

var accept_struct = {
    "clients": "Object"
};

var gameOperate_json = {
    "action": 'monsterAttack'
};

var gameOperate_struct = {
    "action": "String"
};

var getInfo_struct = getConnected_struct

var update_json = {
    "clientID": "",
    "obj": {
        "test": "test"
    }
};
var update_json2 = {
    "clientID": "client2",
    "obj": {
        "test": "test"
    }
};

var update_struct = {
    "clientID": "String",
    "obj": "Object",
    "clients": "Object"
};

var changeState_json = {
    "state": 3
};

var changeState_struct = {
    "state": "Number"
};

var disconnection_struct = {
    "clients": "Object",
    "clientID": "String",
    "host": "String"
};

var data_structs = {
    "getConnected": getConnected_struct,
    "accepted": accept_struct,
    "gameOperate": gameOperate_struct,
    "update": update_struct,
    "getInfo": getInfo_struct,
    "changeState": changeState_struct,
    "serverClose": {},
    "disconnection": disconnection_struct
};

var type_validation = function (client, event_name, done, func) {
    client.on(event_name, function (data) {
        data.should.be.an.object;
        var data_struct = data_structs[event_name];
        for (key in data_struct) {
            data.should.have.property(key).which.is.a[data_struct[key]]
        }
        client.disconnect();
        if (done) done(); else func(data);
    });
}

describe("Multilayer Game Server", function () {
    describe('User Connection', function () {
        beforeEach(function () {
            server.listen(3000);
        });
        //afterEach(function () {
        //    server.close();
        //});
        it('The Client should receive correct format of JSON data after first connected to Server', function (done) {
            var client = io.connect(socketURL, options);
            type_validation(client, 'getConnected', done);
        });

        it('Accept Event is acted correct', function (done) {
            var client = io.connect(socketURL, options);
            client.emit('accept', accept_json);
            type_validation(client, 'accepted', done);
        });
        it('Client should be able to disconnect and the server should know about which client is disconnected', function (done) {
            var client = io.connect(socketURL, options);
            var client2 = io.connect(socketURL, options);
            client.on('getConnected', function (data) {
                clientID = data.clientID;
                client.disconnect();
                type_validation(client2, 'disconnection', null, function (data) {
                    data.clientID.should.equal(clientID);
                    client2.disconnect();
                    done();
                });
            });
        });
    });

    describe('Game Operations', function () {
        it('The Client should receive correct format of JSON data after send the gameOperate message to Server', function (done) {
            var client = io.connect(socketURL, options);
            client.emit('gameOperate', gameOperate_json);
            type_validation(client, gameOperate_json.action, done);
        });
        it('The state of the game should be changed correctly', function (done) {
            var client = io.connect(socketURL, options);
            client.emit('changeState', changeState_json);
            type_validation(client, 'changeState', null, function (data) {
                data.state.should.equal(changeState_json.state);
                done();
            });
        });
    });

    describe('Server Information', function () {
        it('the Client should be able to get information from the server', function (done) {
            var client = io.connect(socketURL, options);
            client.emit('getInfo');
            type_validation(client, 'getInfo', done);
        });

        it('the Client should be able to update the information on the server', function (done) {
            var client = io.connect(socketURL, options);
            client.on('getConnected', function (data) {
                client.emit('accept', accept_json);
                update_json['clientID'] = data.clientID;
                client.emit('update', update_json);
                type_validation(client, 'update', null, function (data) {
                    msg = data.obj;
                    data.clients.should.have.property(update_json['clientID']);
                    data.clients[update_json['clientID']].should.be.eql(msg);
                    client.disconnect();
                    done();
                });
            });
        });
    });

    describe('Server State', function () {
        it('the Server would not accept Client when server is closed', function (done) {
            var client = io.connect(socketURL, options);
            client.on('serverClose', function (msg) {
                var client2 = io.connect(socketURL, options);
                client2.on('getInfo', function (data) {
                    data.accept.should.equal(false);
                    client.disconnect();
                    client2.disconnect();
                    done();
                });
                client2.emit('getInfo');
            });
            client.emit('serverClose');
        });

        it('the Server would accept Client again after the server is opened', function (done) {
            var client = io.connect(socketURL, options);
            client.emit('serverClose');
            client.on('serverClose', function (msg) {
                var client2 = io.connect(socketURL, options);
                client2.emit('getInfo');
                client2.on('getInfo', function (data) {
                    data.accept.should.equal(false);
                    client2.emit('serverOpen');
                    client2.on('serverOpen', function (msg) {
                        var client3 = io.connect(socketURL, options);
                        client3.emit('getInfo');
                        client3.on('getInfo', function (data) {
                            data.accept.should.equal(true);
                            client.disconnect();
                            client2.disconnect();
                            client3.disconnect();
                            done();
                        });
                    });
                });
            });
        });
    });
    describe('Multi users connection', function () {
        it('the count of Clients is correct', function (done) {
            var client = io.connect(socketURL, options);
            client.on('getConnected', function (data) {
                var totalClients = data.totalClients;
                var client2 = io.connect(socketURL, options);
                client2.on('getConnected', function (data) {
                    data.totalClients.should.equal(totalClients + 1);
                    client.disconnect();
                    client2.on('disconnection', function (data) {
                        client2.emit('getInfo');
                        client2.on('getInfo', function (data) {
                            data.totalClients.should.equal(totalClients);
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('Multi users interaction', function () {
        it('Three Clients connect at the same time and do actions', function (done) {
            var client = io.connect(socketURL, options);
            var client2 = io.connect(socketURL, options);
            var client3 = io.connect(socketURL, options);
            var msg_num = 0;
            var msg_validation = function (data) {
                data.should.eql(gameOperate_json);
                console.log(msg_num);
                msg_num++;
                console.log(msg_num);
                if (msg_num === 3) {
                    client.disconnect();
                    client2.disconnect();
                    client3.disconnect();
                    done();
                }
            };
            client.emit('gameOperate', gameOperate_json);
            type_validation(client, gameOperate_json.action, null, function (data) {
                msg_validation(data);
            });
            type_validation(client2, gameOperate_json.action, null, function (data) {
                msg_validation(data);
            });
            type_validation(client3, gameOperate_json.action, null, function (data) {
                msg_validation(data);
            });
        });
    });
});
