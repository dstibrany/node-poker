var util = require('util');
var events = require('events');
var Deck = require('./deck');
var HandAnalyzer = require('./handAnalyzer');
var StateMachine = require('./statemachine');

var Table = function(tableName, numSeats, limit, io) {
    var table = this;
    this.tableName = name;
    this.numSeats = numSeats;
    this.bigBet = limit;
    this.smallBet = limit / 2;

    this.state = {
        potSize: 0,
        currentSeat: null,
        button: null,

        reset: function() {
            this.potSize = 0;
            this.button = table.nextSeat();
        }
        increasePot: function() {
            this.potSize += table.stateMachine.betAmount;
        }
    };

    this.observers = {};
    this.seats = [];
    this.numPlayers = 0;
    
    this.io = io;
    this.deck = new Deck();
    this.stateMachine = new stateMachine(limit);

    this.on('join', this.join);
    this.on('leave', this.leave);
    this.on('sit', this.sit);
    this.on('stand', this.stand);

    events.EventEmitter.call(this);
};
util.inherits(Table, events.EventEmitter);

Table.prototype.startGameLoop = function() {
    this.stateMachine.reset();
    this.emit(this.stateMachine.getState());
};

Table.prototype.stopGameLoop = function() {

};

Table.prototype.initGameLoop = function() {
    this.on('preflop', function() {
        this.potSize = this.smallBet + this.smallBet / 2;
        currentPlayer = this.nextSeat(this.button.seatNumber);
        currentPlayer.player.loseChips(this.smallBet / 2);
        currentPlayer = this.nextSeat(currentPlayer.seatNumber);
        currentPlayer.player.loseChips(this.smallBet);

        currentPlayer = this.nextSeat(currentPlayer.seatNumber);
        currentPlayer.player.getAction();

    });

    this.on('flop', function() {

    });

    this.on('turn', function() {

    });

    this.on('river', function() {

    });

    this.on('showdown', function() {

    });

    this.on('action', function(type, player) {
        switch(type) {
        case 'raise':
            this.increasePot();
            break;
        case 'call':
            this.increasePot();
            break;
        case 'check':
            break;
        case 'fold':
            this.currentPlayer.folded = true;
            break;
        }
        this.emit('nextSeat');
    });

    this.on('nextSeat', function() {
        this.nextSeat().player.getAction();
    });

    this.on('nextState', function() {
        this.emit(this.stateMachine.nextState())
    });
}

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
        this.seats[seatNumber] = new Seat(player, seatNumber);
        this.numPlayers++;
        
        if (this.numPlayers === 1) {
            this.state.button = this.seats[seatNumber];
        } else (this.numPlayers === 2) {
            this.startGameLoop();
        }
    } else {
        console.log('Seat %s is taken on table %s', seatNumber, this.name);
    }
};

Table.prototype.stand = function(player, seatNumber) {
    console.log('Player %s has stood up from table %s', player.name, this.name);
    delete this.seats[seatNumber];
    this.observers[player.name] = player;
    this.numPlayers--;

    if (this.numPlayers === 0) {
        this.state.button = null;
    } else (this.numPlayers === 1) {
        this.stopGameLoop();
        this.state.button = this.nextSeat()
    }
};

Table.prototype.initGameLoopEvents = function() {
    this.on('dealHands', function() {
        console.log('Dealing hands');
        for (var i = 0; i < this.numSeats; i++) {
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

Table.prototype.getNextSeat = function() {
    var nextSeat;
    do {
        currentSeatNum++;
        if (currentSeatNum % this.numSeats === 0) {
            currentSeatNum = 0;
        }
        nextSeat = this.seats[currentSeatNum];
    } while (nextSeat === undefined || nextSeat.folded);

    return nextSeat;
};

Table.prototype.broadcast = function(event, data) {
    console.log(data);
    if (this.io) {
        this.io.sockets.in(this.tableName).emit(event, data || null);
    }
};

var Seat = function(player, seatNumber) {
    this.player = player;
    this.sittingOut = true;
    this.folded = false;
    this.seatNumber = seatNumber;
    this.chipCount;
};

Seat.prototype.reset = function() {
    this.folded = false;
};

module.exports = Table;