var socketio = require('socket.io');
var Player = require('./lib/player');
var Table = require('./lib/table');

var game = {
    players: {},
    tables: {}
}

var init = function(server) {
    var io = game.io = socketio.listen(server);
    createTables();

    io.on('connection', function(socket) {
        var counter = Object.keys(game.players).length;
        var player = new Player('Player ' + counter, socket);
        game.players[player.name] = player;
        player.joinTable(game.tables['table1']);
        player.sit('table1', counter);
    });
};

var createTables = function() {
    game.tables['table1'] = new Table('table1', 6, game.io);
    game.tables['table2'] = new Table('table2', 2, game.io);
    game.tables['table3'] = new Table('table3', 10, game.io);
};

exports.init = init;
