var StateMachine = function(limit, table) {
    this.states       = ["preflop", "flop", "turn", "river", "showdown"];
    this.state        = -1;
    this.table        = table;
    this.limit        = limit;
    this.minBetAmount = limit / 2;
};

StateMachine.prototype.nextState = function() {
    this.state = ++this.state % this.states.length;

    switch(this.states[this.state]) {
        case "preflop":
            this.minBetAmount = this.limit / 2;
            this.reset_betting_round();
            this.currentBet = this.minBetAmount;
            this.currentSeat = this.button = this.table.rotateButton();
            this.potSize = 0;
            this.numPlayersInHand = 0;
            break;
        case "flop":
            this.reset_betting_round();
            break;
        case "turn":
            this.minBetAmount = this.limit;
            this.reset_betting_round();
            break;
        case "river":
            this.reset_betting_round();
            break;
    }

    return this.getState();
};

StateMachine.prototype.getState = function() {
    return this.states[this.state];
};

StateMachine.prototype.increasePot = function(amount, isRaise) {
    if (isRaise) {
        this.numRaises++;
        this.currentBet += this.minBetAmount;        
    }
    this.potSize += amount;
};

StateMachine.prototype.addBlinds = function() {
    this.potSize = this.minBetAmount + (this.minBetAmount / 2);
};

StateMachine.prototype.reset_betting_round = function() {
    this.numRaises = 0;
    this.lastToRaise = null;
    this.firstToAct = null;
    this.currentBet = 0;
    this.currentSeat = this.button;
};

StateMachine.prototype.reset = function() {
    this.state = -1;
    this.minBetAmount = this.limit / 2;
    this.potSize = 0;
    this.currentSeat = null;
    this.lastToRaise = null;
};

module.exports = StateMachine;