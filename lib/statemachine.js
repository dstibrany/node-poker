var StateMachine = function(limit, table) {
    this.states = ["preflop", "flop", "turn", "river", "showdown"];
    this.state = -1;
    this.table = table;
    this.limit = limit;
    this.minBetAmount = limit / 2;
};

StateMachine.prototype.nextState = function() {
    var reset_values = function() {
        this.numRaises = 0;
        this.lastToRaise = null;
        this.firstToAct = null;
        this.currentBet = 0;
        this.currentSeat = this.button;
    }.bind(this);

    this.state = ++this.state % this.states.length;

    switch(this.states[this.state]) {
    case "preflop":
        this.minBetAmount = this.limit / 2;
        reset_values();
        this.currentBet = this.minBetAmount;
        this.currentSeat = this.button = this.table.rotateButton();
        this.potSize = 0;
        break;
    case "flop":
        reset_values();
        break;
    case "turn":
        this.minBetAmount = this.limit;
        reset_values();
        break;
    case "river":
        reset_values();
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

StateMachine.prototype.reset = function() {
    this.state = -1;
    this.minBetAmount = this.limit / 2;
    this.potSize = 0;
    this.currentSeat = null;
    this.lastToRaise = null;
};

module.exports = StateMachine;