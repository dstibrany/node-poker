var util = require('util');
var events = require('events');

var Player = function(name, socket) {
    events.EventEmitter.call(this);
    this.name = name;
    this.socket = socket;
    this.tables = {};
};
util.inherits(Player, events.EventEmitter);

Player.prototype.joinTable = function(table) {
    this.tables[table.name] = {
        tableObj: table,
        seatNumber: null
    }
    this.socket.join(table.name);
    table.emit('join', this);
};

Player.prototype.leaveTable = function(tableName) {
    this.tables[tableName].tableObj.emit('leave', this);
    this.socket.leave(tableName);
    delete this.tables[tableName];
};

Player.prototype.sit = function(tableName, seatNumber) {
    this.tables[tableName].seatNumber = seatNumber;
    this.tables[tableName].tableObj.emit('sit', this, seatNumber);
};

Player.prototype.stand = function(tableName) {
    var table = this.tables[tableName];
    table.tableObj.emit('stand', this, table.seatNumber);
    table.seatNumber = null;
};

Player.prototype.getHoleCards = function(tableName, cards) {
    this.tables[tableName].cards = cards;
    this.socket.emit('getHoleCards', cards.print());
};

Player.prototype.bet = function() {
    this.emit('bet');
};

Player.prototype.fold = function() {
    
};

Player.prototype.raise = function() {
    
};

Player.prototype.check = function() {
    
};

module.exports = Player;