var util         = require('util');
var events       = require('events');
var Deck         = require('./deck');
var HandAnalyzer = require('./handAnalyzer');
var StateMachine = require('./statemachine');

var Table = function(name, numSeats, limit, io) {
    this.name = name;
    this.numSeats = numSeats;

    this.observers = {};
    this.seats = [];
    this.numPlayersSeated = 0;
    
    this.deck = new Deck();
    this.state = new StateMachine(limit, this);
    this.io = io;

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
    var state = this.state.nextState();
    this.emit(state);
};

Table.prototype.stopGameLoop = function() {

};

Table.prototype.initGameLoop = function() {
    this.on('preflop', function() {
        var seat, dealCards;
        this.rotateButton();

        // add big blind + small blind to pot;
        this.state.addBlinds();
        // if Heads-Up
        if ((this.state.numPlayersInHand = this.getNumPlayersInHand()) === 2) {
            this.state.currentSeat.payBlind(this.state.minBetAmount / 2); // SB
        } else {
            this.nextSeat().payBlind(this.state.minBetAmount / 2); // SB
        }
        this.nextSeat().payBlind(this.state.minBetAmount); // BB

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
        var seat, hand, winningHand, winner;
        var handAnalyzer = new HandAnalyzer(this.boardCards);
        console.time('HandAnalyzer');
        this.seats.forEach(function(seat) {
            if (this.isPlayerInHand(seat)) {
                hand = handAnalyzer.analyze(seat.cards);
                if (!winningHand || hand.weight > winningHand.weight) {
                    winningHand = hand;
                    winner = seat.player;
                }
            }
        }, this);
        console.timeEnd('HandAnalyzer');

        console.log('%s wins with %s'.info, winner.name, winningHand.handType);
        console.log('Winning hand: '.info + winningHand.hand);
    });

    this.on('action', function(type, player) {
        if (type === 'raise') {
            this.state.lastToRaise = this.state.currentSeat;
            this.state.currentSeat.raise();
        } 
        else if (type === 'call') {
            this.state.currentSeat.call();
        }
        else if (type === 'fold') {
            this.state.currentSeat.fold();
            this.state.numPlayersInHand--;
        }
        
        console.log('Potsize: $%s'.info, this.state.potSize.toString());
        
        this.emit('nextSeat');
    });

    this.on('nextSeat', function() {
        var nextSeat = this.nextSeat();
        var lastToRaise = this.state.lastToRaise;

        if (this.state.numPlayersInHand === 1) {
            return console.log(nextSeat.player.name + ' wins the pot!');
        }
        
        if (nextSeat === lastToRaise 
            || (!lastToRaise && nextSeat === this.state.firstToAct)) {
            this.emit('nextState');
        } 
        else {
            if (!this.state.firstToAct) {
                this.state.firstToAct = nextSeat;
            }
            nextSeat.player.getAction();
        }
    });

    this.on('nextState', function() {
        // reset the amount each player has bet per round
        this.seats.forEach(function(seat) {
            if (seat) seat.amountBetAlready = 0;
        });
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
        this.seats[seatNumber] = new Seat(player, seatNumber, this.state);
        this.numPlayersSeated++;
        
        if (this.numPlayersSeated === 1) {
            this.state.button = this.seats[seatNumber];
        } 
        else if (this.numPlayersSeated === 2) {
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
    this.numPlayersSeated--;

    if (this.numPlayersSeated === 0) {
        this.state.button = null;
        this.state.currentSeat = null;
    } else if (this.numPlayersSeated === 1) {
        this.stopGameLoop();
        this.state.button = this.nextSeat();
    }
};

Table.prototype.rotateButton = function() {
    this.state.currentSeat = this.state.button = this._nextSeat(this.state.button);
};

// stateful
Table.prototype.nextSeat = function() {
    return this.state.currentSeat = this._nextSeat(this.state.currentSeat);
};

// stateless
Table.prototype._nextSeat = function(currentSeat) {
    var nextSeat, currentSeatNum = currentSeat.seatNumber;
    do {
        nextSeat = this.seats[++currentSeatNum % this.numSeats];
    }
    while (!this.isPlayerInHand(nextSeat));
    return nextSeat;
};

Table.prototype.getNumPlayersInHand = function() {
    var count = 0;
    this.seats.forEach(function(seat) {
        if (this.isPlayerInHand(seat)) count++;
    }, this);
    return count;
}

Table.prototype.isPlayerInHand = function(seat) {
    return seat && seat.isInHand();
};

Table.prototype.broadcast = function(event, data) {
    console.log(data);
    if (this.io) {
        this.io.sockets.in(this.tableName).emit(event, data || null);
    }
};

var Seat = function(player, seatNumber, tableState) {
    this.player = player;
    this.tableState = tableState;
    this.seatNumber = seatNumber;
    this.sittingOut = false;
    this.folded = false;
    this.cards = null;
    this.chipCount;
    this.amountBetAlready = 0;
};

Seat.prototype.raise = function() {
    var raiseAmount = this.tableState.currentBet + this.tableState.minBetAmount - this.amountBetAlready;
    this.amountBetAlready += raiseAmount;
    this.tableState.increasePot(raiseAmount, true);
    // todo: decrease player chip count
};

Seat.prototype.call = function() {
    var callAmount = this.tableState.currentBet - this.amountBetAlready;
    this.amountBetAlready += callAmount;
    this.tableState.increasePot(callAmount);
    // todo: decrease player chip count
};

Seat.prototype.fold = function() {
    this.folded = true;
};

Seat.prototype.payBlind = function(amount) {
    this.player.payBlind(amount);
    this.amountBetAlready += amount;
};

Seat.prototype.isInHand = function() {
    return !this.folded && !this.sittingOut;
};

Seat.prototype.reset = function() {
    this.folded = false;
    this.cards = null;
};

module.exports = Table;