var util   = require('util');
var events = require('events');

var Player = function(name, socket) {
    events.EventEmitter.call(this);
    this.name = name;
    this.socket = socket;
    this.tables = {};
    this.chips;

    if (this.socket) {
        this.bindSocketListeners();
    }
};
util.inherits(Player, events.EventEmitter);


Player.prototype.bindSocketListeners = function() {
    this.socket.on('raise', this.raise);
    this.socket.on('fold', this.fold);
    this.socket.on('check', this.check);
    this.socket.on('call', this.call);
};

Player.prototype.getTable = function(tableName) {
    return this.tables[tableName].table;
};

Player.prototype.joinTable = function(table) {
    this.tables[table.name] = {
        table: table,
        seatNumber: null
    }
    table.emit('join', this);
    if (this.socket) {
        this.socket.join(table.name);
    }
};

Player.prototype.leaveTable = function(tableName) {
    this.tables[tableName].table.emit('leave', this);
    delete this.tables[tableName];
    if (this.socket) {
        this.socket.leave(tableName);
    }
};

Player.prototype.sit = function(tableName, seatNumber) {
    this.tables[tableName].seatNumber = seatNumber;
    this.getTable(tableName).emit('sit', this, seatNumber);
};

Player.prototype.stand = function(tableName) {
    this.getTable(tableName).emit('stand', this, table.seatNumber);
    this.tables[tableName].seatNumber = null;
};

Player.prototype.receiveCards = function(tableName, cards) {
    this.tables[tableName].cards = cards;
    if (this.socket) {
        this.socket.emit('getHoleCards', cards.print());
    } else {
        console.log('%s\'s cards: ', this.name, cards.print());
    }
};

Player.prototype.payBlind = function(amount) {
    console.log('%s has paid %s in blinds', this.name, amount);
};

Player.prototype.getAction = function() {
    if (this.socket) {
        this.socket.emit('getAction');
    } else {
        console.log('%s, select an action (raise, call, check, fold):'.prompt, this.name);
        process.stdin.resume();
    }
};

Player.prototype.doAction = function(tableName, type) {
    this.getTable(tableName).emit('action', type, this);
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

Player.prototype.transport = function() {
    process.stdin.resume();

};

module.exports = Player;

