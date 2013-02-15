var util   = require('util');
var utils  = require('./lib/utils')
var Player = require('./lib/player');
var Table  = require('./lib/table');

var table   = new Table('Table1', 6, 10);
var player1 = new Player('Dave');
var player2 = new Player('Pokey');

player1.joinTable(table);
player2.joinTable(table);

player1.sit('Table1', 0);
player2.sit('Table1', 1);

process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    chunk = chunk.trim();
    var currentPlayer = table.state.currentSeat.player;
    if (/raise|call|bet|check|fold/.test(chunk)) {
        process.stdin.pause();
        currentPlayer.doAction(table.name, chunk);
        
    } 
});



