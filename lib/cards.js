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

Cards.prototype.merge = function(cards) {
    return new Cards(this.cards.concat(cards.cards));
}

Cards.prototype.splice = function(rank) {
    var cards = this.cards;
    var splicedCards= [];

    for (var i = 0; i < cards.length; i++) {
        if (cards[i].rank === rank) {
            splicedCards = splicedCards.concat(cards.splice(i, 1));
            i--;
        }
    }
    
    return new Cards(splicedCards);
}

// insertion sort
Cards.prototype.sort = function() {
    var item, iHole;
    var cards = this.cards;

    for (var i = 1, len = cards.length; i < len; i++) {
        item = cards[i];
        iHole = i;

        while (iHole > 0 && cards[iHole - 1].rankToInt() > item.rankToInt()) {
            cards[iHole] = cards[iHole - 1];
            iHole--; 
        }
        cards[iHole] = item;
    }

    return this;
};

module.exports = Cards;