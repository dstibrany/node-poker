var util = require('util');
var events = require('events');
var Deck = require('./deck');
var HandAnalyzer = require('./handAnalyzer');

var Table = function(name, maxNumSeats, io) {
    events.EventEmitter.call(this);
    this.name = name;
    this.maxNumSeats = maxNumSeats;
    this.observers = {};
    this.seats = [];
    this.numPlayers = 0;
    this.deck = new Deck();
    this.io = io;

    this.on('join', this.join);
    this.on('leave', this.leave);
    this.on('sit', this.sit);
    this.on('stand', this.stand);
};
util.inherits(Table, events.EventEmitter);

Table.prototype.join = function(player) {
    console.log('Player %s has joined table %s', player.name, this.name);
    this.observers[player.name] = player;
};

Table.prototype.leave = function(player) {
    console.log('Player %s has left table %s', player.name, this.name);
    delete this.observers[player.name];
};

Table.prototype.sit = function(player, seatNumber) {
    if (this.seats[seatNumber] === undefined) {
        console.log('Player %s is sitting at table %s in seat %s', player.name, this.name, seatNumber);
        delete this.observers[player.name];
        this.seats[seatNumber] = player;
        this.numPlayers++;
        
        if (this.numPlayers === 1) {
            this.buttonIndex = seatNumber;
        }
        if (this.numPlayers === 2) {
            this.startGameLoop();
        }
    } else {
        console.log('Seat %s is taken on table %s', seatNumber, this.name);
    }
};

Table.prototype.stand = function(player, seatNumber) {
    console.log('Player %s has stood up from table %s', player.name, this.name);
    this.seats[seatNumber] = undefined;
    this.obsevers[player.name] = player;
    this.numPlayers--;
};

Table.prototype.initGameLoopEvents = function() {
    this.on('dealHands', function() {
        console.log('Dealing hands');
        for (var i = 0; i < this.maxNumSeats; i++) {
            if (player = this.seats[i]) {
                player.getHoleCards(this.name, this.deck.dealCards(2));
            }
        }        
    });

    this.on('flop', function() {
        console.log('Dealing flop');
        this.boardCards = this.deck.dealCards(3);
        this.broadcast('flop', this.boardCards.print());
    });

    this.on('turn', function() {
        console.log('Dealing turn');
        this.boardCards.merge(this.deck.dealCards(1));
        this.broadcast('turn', this.boardCards.print());
    });

    this.on('river', function() {
        console.log('Dealing river');
        this.boardCards.merge(this.deck.dealCards(1));
        this.broadcast('river', this.boardCards.print());
    });

    this.on('action', function(type, player) {

    });
};

Table.prototype.startGameLoop = function() {
    var player;
    
};

Table.prototype.rotateButton = function() {
    
};

Table.prototype.broadcast = function(event, data) {
    console.log(data);
    if (this.io) {
        this.io.sockets.in(this.tableName).emit(event, data || null);
    }
};

module.exports = Table;