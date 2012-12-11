var Deck = require('./deck.js');
var Cards = require('./cards.js');

var Dealer = function() {
    this.deck = new Deck();
}

Dealer.prototype.dealCard = function() {
    return this.deck.dealCard();
};

Dealer.prototype.dealCards = function(numCards) {
    var cards = [];
    for (var i = 0, len = numCards; i < len; i++) {
        cards.push(this.dealCard());
    }
    return new Cards(cards);
};

Dealer.prototype.dealFlop = function() {
    return this.dealCards(3);
};

Dealer.prototype.dealTurn = function() {
    return this.dealCards(2);
};

Dealer.prototype.dealRiver = function() {
    return this.dealCards(2);
};

module.exports = Dealer;