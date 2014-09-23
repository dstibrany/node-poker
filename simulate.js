var util   = require('util');
var utils  = require('./lib/utils')
var Player = require('./lib/player');
var Table  = require('./lib/table');

// create a table
var table   = new Table('Table1', 6, 10);

// create players with initial chip counts
var player1 = new Player('Dave', 1000);
var player2 = new Player('Pokey', 1000);
var player3 = new Player('Willy', 1000);

// join table
player1.joinTable(table);
player2.joinTable(table);
player3.joinTable(table);

// choose a seat an buy-in
player1.sit('Table1', 0, 500);
player2.sit('Table1', 1, 500);
player3.sit('Table1', 2, 500);

// sit in next hand
player1.sitIn('Table1');
player2.sitIn('Table1');

// once two players are sitting at a table, the game loop starts
// so player3 won't actually be 'in' the hand until the next round
player3.sitIn('Table1');

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
