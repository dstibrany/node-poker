var StateMachine = function(limit, table) {
    this.states = ["preflop", "flop", "turn", "river", "showdown"];
    this.state = -1;
    this.table = table;
    this.limit = limit;
    this.betAmount = limit / 2;
};

StateMachine.prototype.nextState = function() {
    this.state = ++this.state % this.states.length;

    switch(this.states[this.state]) {
    case "preflop":
        this.currentSeat = this.button = this.table.rotateButton();
        this.potSize = 0;
        this.numRaises = 0;
        this.lastToRaise = null;
        this.betAmount = this.limit / 2;
        break;
    case "flop":
        this.currentSeat = this.button
        this.lastToRaise = null;
        this.numRaises = 0;
        break;
    case "turn":
        this.currentSeat = this.button
        this.lastToRaise = null;
        this.betAmount = this.limit;
        this.numRaises = 0;
        break;
   case "river":
       this.currentSeat = this.button
        this.lastToRaise = null;
        this.numRaises = 0;
        break;
    }
    return this.getState();
};

StateMachine.prototype.getState = function() {
    return this.states[this.state];
};

StateMachine.prototype.increasePot = function(raise) {
    if (raise) this.numRaises++;
    this.potSize += this.numRaises * this.betAmount;
};

StateMachine.prototype.addBlinds = function() {
    this.potSize = this.betAmount + (this.betAmount / 2);
};

StateMachine.prototype.reset = function() {
    this.state = -1;
    this.betAmount = this.limit / 2;
    this.potSize = 0;
    this.currentSeat = null;
    this.lastToRaise = null;
};

module.exports = StateMachine;