var Cards = function(cards) {
    this.cards = cards;
};

Cards.prototype.print = function() {
    var cards = this.cards.map(function(card) {
        return card.toString();
    });
    return cards;
};

Cards.prototype.toArray = function() {
    return this.cards;
};

Cards.prototype.toString = function() {
    var cards = this.toArray();
    var string = '';
    for (var i = 0, len = cards.length; i < len; i++) {
        string += cards[i].toString();
    };

    return string;
};

module.exports = Cards;