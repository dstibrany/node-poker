var _ = require('./utils.js')._;
var Card = require('./card.js');

// @param {string|array} - can be an array of Card object or
//                         a string(rank, suit) eg. Tc9h6s
var Cards = function(cards) {
    if (typeof cards === 'string') {
        this.cards = [];
        for (var i = 0; i < cards.length; i += 2) {
            this.cards.push(new Card(cards[i], cards[i + 1]));
        }
    } else {
        this.cards = cards;
    }
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

Cards.prototype.clone = function() {
    return new Cards(_.clone(this.cards));
}

Cards.prototype.merge = function(cards) {
    return new Cards(this.cards.concat(cards.toArray()));
};

Cards.prototype.reduce = function(cb) {
    var cards = this.cards;
    var weight = 0;
    for (var i = 0, len = cards.length; i < len; i++) {
        weight = cb(weight, cards[i]);
    }
    return weight;
};

Cards.prototype.unique = function() {
    return new Cards(_.unique(this.cards, true, function(card) {
        return card.rank;
    }));
};

Cards.prototype.splice = function(index, howMany) {
    return new Cards(this.cards.splice.apply(this.cards, arguments));
};

Cards.prototype.spliceByRank = function(rank) {
    var cards = this.cards;
    var splicedCards= [];

    for (var i = 0; i < cards.length; i++) {
        if (cards[i].rank === rank) {
            splicedCards = splicedCards.concat(cards.splice(i, 1));
            i--;
        }
    }
    
    return new Cards(splicedCards);
};

Cards.prototype.spliceBySuit = function(suit) {
    var cards = this.cards;
    var splicedCards= [];

    for (var i = 0; i < cards.length; i++) {
        if (cards[i].suit === suit) {
            splicedCards = splicedCards.concat(cards.splice(i, 1));
            i--;
        }
    }
    
    return new Cards(splicedCards);
};

Cards.prototype.spliceStraight = function(highEndRank) {
    var cards = this.unique();
    var cardsArray = cards.toArray();
    var splicedCards;

    for (var i = 0, len = cardsArray.length; i < len; i++) {
        if (cardsArray[i].rank === highEndRank) {
            // special case for low-end straights
            if (highEndRank === '5') {
                splicedCards = cards.spliceByRank('A'); 
                splicedCards = splicedCards.merge(cards.splice(i - 3, 4));
            } else {
                splicedCards = cards.splice(i - 4, 5);
            }
            break;
        }
    }

    return splicedCards;
};

Cards.prototype.spliceFlush = function(suit) {
    return this.spliceBySuit(suit).splice(-5);
};


// insertion sort
Cards.prototype.sort = function() {
    var card, iHole;
    var cards = this.cards;

    for (var i = 1, len = cards.length; i < len; i++) {
        card = cards[i];
        iHole = i;

        while (iHole > 0 && cards[iHole - 1].weight > card.weight) {
            cards[iHole] = cards[iHole - 1];
            iHole--; 
        }
        cards[iHole] = card;
    }

    return this;
};

module.exports = Cards;