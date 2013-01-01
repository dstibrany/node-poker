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

module.exports = Dealer;