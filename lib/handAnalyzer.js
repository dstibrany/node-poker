var _ = require('lodash');

// @param {{Cards}}
var HandAnalyzer = function(board) {
    // Parse cards in board and cache results for reuse
    this.board = board.sort();
    this.boardCount = new HandCount(this.board.toString());
};

HandAnalyzer.prototype.newHand = function(hand) {
    this.fullHouse = [], this.quads = [], this.trips = [], this.pairs = [];
    return new HandCount(hand.toString());
};

// @param {{Cards}}
HandAnalyzer.prototype.analyze = function(hand) {
    // combine hand counts for board and players hand
    this.handCount = this.boardCount.combine(this.newHand(hand));
    // create sorted hand of all 7 cards
    this.allCards = hand.merge(this.board.clone()).sort();
    // parse pairs (ie. quads, trips, pairs)
    this.parsePairs();

    // analyze hand
    var rank, ranks;
    var finalHand, handType, weight;
    var flushCardSuit = this.isFlush();
    var straightCardRank = this.isStraight();

    if (rank = this.isStraightFlush(straightCardRank, flushCardSuit)) {
        handType = this.handCount.intToRank(rank) === 'A' ? 'ROYALFLUSH' : 'STRAIGHTFLUSH';
        finalHand = this.allCards.spliceStraight(rank).map(function(card) {
            card.suit = flushCardSuit;
            return card;
        });
    }
    else if (rank = this.isQuads()) {
        handType = 'QUADS';
        finalHand = this.allCards.spliceByRank(rank).merge(this.allCards.splice(-1));

    }
    else if (rank = this.isFullHouse()) {
        handType = 'FULLHOUSE';
        finalHand = this.allCards.spliceByRank(rank[0]).merge(this.allCards.spliceByRank(rank[1]));
    }
    else if (flushCardSuit) {
        handType = 'FLUSH';
        finalHand = this.allCards.spliceFlush(flushCardSuit);
        rank = finalHand.cards[4].rank;
    }
    else if (rank = straightCardRank) {
        handType = 'STRAIGHT';
        finalHand = this.allCards.spliceStraight(straightCardRank);
    }
    else if (rank = this.isTrips()) {
        handType = 'TRIPS';
        finalHand = this.allCards.spliceByRank(rank).merge(this.allCards.splice(-2));
    }
    else if (rank = this.isTwoPair()) {
        handType = 'TWOPAIR';
        finalHand = this.allCards.spliceByRank(rank[0])
                        .merge(this.allCards.spliceByRank(rank[1]))
                        .merge(this.allCards.splice(-1));
    }
    else if (rank = this.isPair()) {
        handType = 'PAIR';
        finalHand = this.allCards.spliceByRank(rank).merge(this.allCards.splice(-3));
    }
    else {
        handType = 'HIGHCARD';
        finalHand = this.allCards.splice(-5);
    }

    return {
        handType: this.handTypes[handType].title,
        hand: finalHand,
        weight: this.getHandWeight(handType, finalHand, rank)
    }
};

HandAnalyzer.prototype.getHandWeight = function(handType, hand, rank) {
    var reduceCallback;
    // we need a multiplier of 1 for highcard hands; otherwise we can use a formula
    var multiplier = handType === 'HIGHCARD' ? 1 :
                        10 * Math.pow(10, this.handTypes[handType].value);

    // special case for TwoPair weight
    if (handType === 'TWOPAIR') {
        reduceCallback = function(weight, card) {
            if (card.rank === rank[0])
                weight += multiplier * card.weight;
            else if (card.rank === rank[1])
                weight += 100 * card.weight;
            else
                weight += card.weight;

            return weight;
        };        
    } else {
        reduceCallback = function(weight, card) {
            if (card.rank === rank)
                weight += multiplier * card.weight;
            else
                weight += card.weight;

            return weight;
        };
    }

    return hand.reduce(reduceCallback);
};

HandAnalyzer.prototype.handTypes = {
    HIGHCARD: {
        value: 0,
        title: 'High card'
    },
    PAIR: {
        value: 1,
        title: 'Pair'
    },
    TWOPAIR: {
        value: 2,
        title: 'Two pairs'
    },
    TRIPS: {
        value: 3,
        title: 'Three of a kind'
    },
    STRAIGHT: {
        value: 4,
        title: 'Straight'
    },
    FLUSH: {
        value: 5,
        title: 'Flush'
    },
    FULLHOUSE: {
        value: 6,
        title: 'Full house'
    },
    QUADS: {
        value: 7,
        title: 'Four of a kind'
    },
    STRAIGHTFLUSH: {
        value: 8,
        title: 'Straight flush'
    },
    ROYALFLUSH: {
        value: 9,
        title: 'Royal flush'
    }
};

HandAnalyzer.prototype.isStraightFlush = function(straightCardRank, flushCardSuit) {
    if (straightCardRank === false || flushCardSuit === false)
        return false;
    var flushCards = this.allCards.clone().spliceBySuit(flushCardSuit);
    var straightFlushHandCount =  {
        handCount: new HandCount(flushCards.toString())
    }
    return this.isStraight.call(straightFlushHandCount); 
};

HandAnalyzer.prototype.isQuads = function() {
    return this.quads.length > 0 ? this.quads.slice(-1).toString() : false;
};

HandAnalyzer.prototype.isFullHouse = function() {
    var trips = this.isTrips();
    var pairs = this.isTwoPair();
    if (trips && pairs)
        return trips + _(pairs).without(trips).last();
    else
        return false;
};

HandAnalyzer.prototype.isFlush = function() {
    var flushSuit;
    var suitCount = this.handCount.suitCount;
    var flush = Object.keys(suitCount).some(function(suit) {
        flushSuit = suit;
        return suitCount[suit] >= 5;
    });

    return flush ? flushSuit : false;
};

// @return rank of the high end of straight, if there is a straight; false otherwise
HandAnalyzer.prototype.isStraight = function() {
    var index;
    var rankCount = this.handCount.rankCount;
    var intToRank = this.handCount.intToRank;
    var straightCounter = 0;
    var straight = false;

    // 14 is the rank of an Ace
    // 1 is also used as a rank for an Ace so we can check for a low straight
    for (var i = 14; i >= 1; i--) {
        // special case for detecting low-end straights
        index = (i === 1) ? 14 : i;
        if (rankCount[intToRank(index)] > 0)
            straightCounter++;
        else
            straightCounter = 0;

        if (straightCounter === 5) {
            straight = intToRank(i + 4); // return high-end
            break;
        }
    }
    return straight;
};

HandAnalyzer.prototype.isTrips = function() {
    return this.trips.length > 0 ? this.trips.slice(-1).toString() : false;
};

HandAnalyzer.prototype.isTwoPair = function() {
    return this.pairs.length >= 2  ? this.pairs.slice(-2).reverse().join('') : false;
};

HandAnalyzer.prototype.isPair = function() {
    return this.pairs.length > 0 ? this.pairs.slice(-1).toString() : false;
};

HandAnalyzer.prototype.parsePairs = function() {
    var rank;
    var rankCount = this.handCount.rankCount;
    for (var i = 2; i <= 14; i++) {
        rank = this.handCount.intToRank(i);
        if (rankCount[rank] === 4)
            this.quads.push(rank);
        if (rankCount[rank] >= 3)
            this.trips.push(rank);
        if (rankCount[rank] >= 2)
            this.pairs.push(rank);
    }
};


var HandCount = function(handStr) {
    handStr = handStr || '';
    this.suitCount = {
        'd': 0, 'c': 0,
        'h': 0, 's': 0
    };
    this.rankCount = {
        '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0,
        '9': 0, 'T': 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 0
    };
    for (var i = 0, len = handStr.length; i < len; i++) {
        if (_.isNumber(this.suitCount[handStr[i]]))
            this.suitCount[handStr[i]]++;
        else
            this.rankCount[handStr[i]]++;
    }
};

HandCount.prototype.combine = function(countObj) {
    var self = this;
    var combinedCount = new HandCount();

    _.each(this.suitCount, function(value, key) { 
        combinedCount.suitCount[key] = self.suitCount[key] + countObj.suitCount[key];
    });
    _.each(this.rankCount, function(value, key) { 
        combinedCount.rankCount[key] = self.rankCount[key] + countObj.rankCount[key];
    });

    return combinedCount;
};

HandCount.prototype.intToRank = function(int) {
    var rank;
    switch(int) {
    case 10:
        rank = 'T';
        break;
    case 11:
        rank = 'J';
        break;
    case 12:
        rank = 'Q';
        break;
    case 13:
        rank = 'K';
        break;
    case 14:
        rank = 'A';
        break;
    default:
        rank = int + '';
    }
    return rank
};

module.exports = HandAnalyzer;