var util   = require('util');
var utils  = require('./lib/utils')
var Player = require('./lib/player');
var Table  = require('./lib/table');

var table   = new Table('Table1', 6, 10);
var player1 = new Player('Dave', 1000);
var player2 = new Player('Pokey', 1000);

player1.joinTable(table);
player2.joinTable(table);

player1.sit('Table1', 0, 500);
player2.sit('Table1', 1, 500);

process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    var action;
    chunk = chunk.trim();
    var currentPlayer = table.state.currentSeat.player;
    switch (chunk) {
        case 'r':
            action = 'raise';
            break;
        case 'f':
            action = 'fold';
            break;
        case 'c':
            if (table.state.actions.some(function(action) { return action === 'call' }))
                action = 'call';
            else
                action = 'check';
            break;
    }
    if (/^raise|call|check|fold$/.test(chunk)) {
        action = chunk;
    }
    if (action) {
        process.stdin.pause();
        currentPlayer.doAction(table.name, action); 
    }
});



