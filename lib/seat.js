var Seat = function(player, seatNumber, tableState, buyIn) {
    this.player = player;
    this.tableState = tableState;
    this.seatNumber = seatNumber;
    this.sittingOut = true;
    this.folded = false;
    this.cards = null;
    this.chips = buyIn;
    this.amountBetPerRound = 0;
    this.amountBetPerHand = 0;
};

Seat.prototype.raise = function() {
    var raiseAmount = this.tableState.currentBet + this.tableState.minBetAmount - this.amountBetPerRound;
    this.amountBetPerRound += raiseAmount;
    this.amountBetPerHand += raiseAmount;
    this.tableState.increasePot(raiseAmount, true);
    this.chips -= raiseAmount;
};

Seat.prototype.call = function() {
    var callAmount = this.tableState.currentBet - this.amountBetPerRound;
    this.amountBetPerRound += callAmount;
    this.amountBetPerHand += callAmount;
    this.tableState.increasePot(callAmount);
    this.chips -= callAmount;
};

Seat.prototype.fold = function() {
    this.folded = true;
    this.lostHand();
};

Seat.prototype.payBlind = function(amount) {
    this.player.payBlind(amount);
    this.amountBetPerRound += amount;
    this.amountBetPerHand += amount;
    this.chips -= amount;
};

Seat.prototype.isInHand = function() {
    return !this.folded && this.cards;
};

Seat.prototype.isSittingIn = function() {
    return !this.sittingOut;
};

Seat.prototype.wonHand = function(amount) {
    this.chips += amount;
    this.player.wonHand(amount - this.amountBetPerHand);
};

Seat.prototype.lostHand = function() {
    this.player.lostHand(this.amountBetPerHand);
};

Seat.prototype.reset = function() {
    this.folded = false;
    this.cards = null;
    this.amountBetPerRound = 0;
    this.amountBetPerHand = 0;
};

module.exports = Seat;