var StateMachine = function(limit) {
    this.states = ["preflop", "flop", "turn", "river", "showdown"];
    this.state = 0;
    this.limit = limit;
    this.betAmount = limit / 2;
};

StateMachine.prototype.nextState = function() {
    this.state = ++this.state % this.states.length;
    switch(this.states[this.state]) {
    case "preflop":
        this.betAmount = this.limit / 2;
        break;
    case "turn":
        this.betAmount = this.limit;
        break;
    }
    return this.getState();
};

StateMachine.prototype.getState = function() {
    return this.states[this.state];
};

StateMachine.prototype.reset = function() {
    this.state = 0;
    this.betAmount = this.limit / 2;
};

module.exports = StateMachine;