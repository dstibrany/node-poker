var util         = require('util');
var events       = require('events');
var Deck         = require('./deck');
var HandAnalyzer = require('./handAnalyzer');
var StateMachine = require('./statemachine');

var Table = function(name, numSeats, limit, io) {
    var table = this;
    this.name = name;
    this.numSeats = numSeats;

    // this.state = {
    //     potSize: 0,
    //     currentSeat: null,
    //     button: null,
    //     lastToRaise: null,

    //     reset: function() {
    //         this.lastToRaise = null;
    //         this.potSize = 0;
    //         this.currentSeat = this.button = table.rotateButton();
    //     },
    //     increasePot: function(amount) {
    //         amount = amount || table.state.betAmount;
    //         this.potSize += amount;
    //         console.log('Potsize: $%s'.info, this.potSize.toString());
    //     }
    // };

    this.observers = {};
    this.seats = [];
    this.numPlayers = 0;
    
    this.io = io;
    this.deck = new Deck();
    this.state = new StateMachine(limit, this);

    this.on('join', this.join);
    this.on('leave', this.leave);
    this.on('sit', this.sit);
    this.on('stand', this.stand);

    this.initGameLoop();

    events.EventEmitter.call(this);
};
util.inherits(Table, events.EventEmitter);

Table.prototype.startGameLoop = function() {
    this.state.reset();
    this.state.currentSeat = this.state.button;
    this.emit(this.state.nextState());
};

Table.prototype.stopGameLoop = function() {

};

Table.prototype.initGameLoop = function() {
    this.on('preflop', function() {
        var seat, dealCards;

        // add big blind + small blind to pot;
        this.state.addBlinds();
        this.nextSeat().player.payBlind(this.state.betAmount / 2);
        this.nextSeat().player.payBlind(this.state.betAmount);

        console.log('Dealing hands'.info);
        for (var i = 0; i < this.numSeats; i++) {
            if (seat = this.seats[i]) {
                cards = this.deck.dealCards(2);
                seat.player.receiveCards(this.name, cards);
                seat.cards = cards;
            }
        }

        this.emit('nextSeat');

    });

    this.on('flop', function() {
        console.log('Dealing flop'.info);
        this.boardCards = this.deck.dealCards(3);
        this.broadcast('flop', this.boardCards.print());
        this.emit('nextSeat');
    });

    this.on('turn', function() {
        console.log('Dealing turn'.info);
        this.boardCards = this.boardCards.merge(this.deck.dealCards(1));
        this.broadcast('turn', this.boardCards.print());
        this.emit('nextSeat');
    });

    this.on('river', function() {
        console.log('Dealing river'.info);
        this.boardCards = this.boardCards.merge(this.deck.dealCards(1));
        this.broadcast('river', this.boardCards.print());
        this.emit('nextSeat');
    });

    this.on('showdown', function() {
        var seat, hand, seatCount = this.numSeats, winningHand, winner;
        var handAnalyzer = new HandAnalyzer(this.boardCards);
        while (seatCount) {
            seat = this._nextSeat(this.state.button);
            hand = handAnalyzer.analyze(seat.cards);
            if (!winningHand || hand.weight > winningHand.weight) {
                winningHand = hand;
                winner = seat.player;
            }
            seatCount--;
        }
        console.log('%s wins with %s'.info, winner.name, winningHand.handType);
        console.log('Winning hand: '.info + winningHand.hand);
    });

    this.on('action', function(type, player) {
        if (type === 'raise') {
            this.state.lastToRaise = this.state.currentSeat;
            this.state.increasePot(true);
        } 
        else if (type === 'call') {
            this.state.increasePot();
        }
        else if (type === 'check') {

        }
        else if (type === 'fold') {
            this.state.currentSeat.folded = true;
        }
        console.log('Potsize: $%s'.info, this.state.potSize.toString());
        this.emit('nextSeat');
    });

    this.on('nextSeat', function() {
        var nextSeat = this.nextSeat();
        if (nextSeat === this.state.lastToRaise) {
            this.emit('nextState');
        } else {
            nextSeat.player.getAction();
        }
    });

    this.on('nextState', function() {
        this.emit(this.state.nextState());
    });
}

Table.prototype.join = function(player) {
    console.log('%s has joined table %s', player.name, this.name);
    this.observers[player.name] = player;
};

Table.prototype.leave = function(player) {
    console.log('%s has left table %s', player.name, this.name);
    delete this.observers[player.name];
};

Table.prototype.sit = function(player, seatNumber) {
    if (this.seats[seatNumber] === undefined) {
        console.log('%s is sitting at table %s in seat %s', player.name, this.name, seatNumber);
        delete this.observers[player.name];
        this.seats[seatNumber] = new Seat(player, seatNumber);
        this.numPlayers++;
        
        if (this.numPlayers === 1) {
            this.state.button = this.seats[seatNumber];
        } 
        else if (this.numPlayers === 2) {
            this.startGameLoop();
        }
    } else {
        console.log('Seat %s is taken on table %s', seatNumber, this.name);
    }
};

Table.prototype.stand = function(player, seatNumber) {
    console.log('%s has stood up from table %s', player.name, this.name);
    delete this.seats[seatNumber];
    this.observers[player.name] = player;
    this.numPlayers--;

    if (this.numPlayers === 0) {
        this.state.button = null;
        this.state.currentSeat = null;
    } else if (this.numPlayers === 1) {
        this.stopGameLoop();
        this.state.button = this.nextSeat();
    }
};

Table.prototype.rotateButton = function() {
    return this._nextSeat(this.state.button);
};

// stateful
Table.prototype.nextSeat = function() {
    return this.state.currentSeat = this._nextSeat(this.state.currentSeat);
};

// stateless
Table.prototype._nextSeat = function(currentSeat) {
    var nextSeat;
    var currentSeatNum = currentSeat.seatNumber;
    do {
        currentSeatNum++;
        if (currentSeatNum % this.numSeats === 0) {
            currentSeatNum = 0;
        }
        nextSeat = this.seats[currentSeatNum];
    } while (nextSeat === undefined || nextSeat.folded || nextSeat.sittingOut);

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
    this.sittingOut = false;
    this.folded = false;
    this.seatNumber = seatNumber;
    this.cards = null;
    this.chipCount;
};

Seat.prototype.reset = function() {
    this.folded = false;
    this.cards = null;
};

module.exports = Table;