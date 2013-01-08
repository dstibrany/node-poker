var util = require('util');
var events = require('events');

var Player = function(name, socket) {
    events.EventEmitter.call(this);
    this.name = name;
    this.socket = socket;
    this.tables = {};

    if (this.socket)
        this.bindSocketListeners();
};
util.inherits(Player, events.EventEmitter);


Player.prototype.bindSocketListeners = function() {
    this.socket.on('bet', this.bet);
    this.socket.on('raise', this.raise);
    this.socket.on('fold', this.fold);
    this.socket.on('check', this.check);
};

Player.prototype.getTable = function(tableName) {
    return this.tables(tableName).table;
};

Player.prototype.joinTable = function(table) {
    this.tables[table.name] = {
        table: table,
        seatNumber: null
    }
    this.socket.join(table.name);
    table.emit('join', this);
};

Player.prototype.leaveTable = function(tableName) {
    this.tables[tableName].table.emit('leave', this);
    this.socket.leave(tableName);
    delete this.tables[tableName];
};

Player.prototype.sit = function(tableName, seatNumber) {
    this.tables[tableName].seatNumber = seatNumber;
    this.getTable(tableName).emit('sit', this, seatNumber);
};

Player.prototype.stand = function(tableName) {
    this.getTable(tableName).emit('stand', this, table.seatNumber);
    this.tables[tableName].seatNumber = null;
};

Player.prototype.getHoleCards = function(tableName, cards) {
    this.tables[tableName].cards = cards;
    this.socket.emit('getHoleCards', cards.print());
};

Player.prototype.doAction = function(tableName, type) {
    this.getTable(tableName).emit('action', type, this);
};

Player.prototype.bet = function(tableName) {
    this.doAction(tableName, 'bet');
};

Player.prototype.raise = function(tableName) {
    this.doAction(tableName, 'raise');
};

Player.prototype.call = function(tableName) {
    this.doAction(tableName, 'call');
};

Player.prototype.fold = function(tableName) {
    this.doAction(tableName, 'fold');
};

Player.prototype.check = function(tableName) {
    this.doAction(tableName, 'check');
};

module.exports = Player;

