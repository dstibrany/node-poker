var Card = function(rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.dealt = false;
};

Card.prototype.toString = function() {
    return this.rank + this.suit;
};

module.exports = Card;