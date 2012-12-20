var _ = require('./utils.js')._;

// @param {{Cards}}
var HandAnalyzer = function(board) {
    // Parse cards in board and cache results for reuse
    this.board = board.sort();
    this.boardCount = new HandCount(this.board.toString());
};

HandAnalyzer.prototype.newHand = function(hand) {
    var handCount = new HandCount(hand.toString());
    this.fullHouse = [];
    this.quads = [];
    this.trips = [];
    this.pairs = [];
    return handCount;
};

// @param {{Cards}}
HandAnalyzer.prototype.analyze = function(hand) {
    // combine hand counts for board and players hand
    this.handCount = this.boardCount.combine(this.newHand(hand));
    // create sorted hand of all 7 cards
    this.allCards = hand.merge(this.board).sort();
    // parse pairs (quads, trips, pairs)
    this.parsePairs();

    // analyze hand
    var finalHand, handType, rank, ranks;
    var flushCardSuit = this.isFlush();
    var straightCardRank = this.isStraight();

    if (rank = this.isStraightFlush(straightCardRank, flushCardSuit)) {
        handType = 8;
        finalHand = this.allCards.spliceStraight(rank);
    }
    else if (rank = this.isQuads()) {
        handType = 7;
        finalHand = this.allCards.spliceByRank(rank).merge(this.allCards.splice(-1));
    }
    else if (ranks = this.isFullHouse()) {
        handType = 6;
        finalHand = this.allCards.spliceByRank(ranks[0]).merge(this.allCards.spliceByRank(ranks[1]));
    }
    else if (flushCardSuit) {
        handType = 5;
        finalHand = this.allCards.spliceFlush(flushCardSuit);
    }
    else if (straightCardRank) {
        handType = 4;
        finalHand = this.allCards.spliceStraight(straightCardRank);
    }
    else if (rank = this.isTrips()) {
        handType = 3;
        finalHand = this.allCards.spliceByRank(rank).merge(this.allCards.splice(-2));
    }
    else if (ranks = this.isTwoPair()) {
        handType = 2;
        finalHand = this.allCards.spliceByRank(ranks[0])
                            .merge(this.allCards.spliceByRank(ranks[1]))
                            .merge(this.allCards.splice(-1));
    }
    else if (rank = this.isPair()) {
        handType = 1;
        finalHand = this.allCards.spliceByRank(rank).merge(this.allCards.splice(-3));
    }
    else {
        handType = 0;
        finalHand = this.allCards.splice(-5)
    }

    return {
        handType: this.handTypes[handType],
        finalHand: finalHand
    }
    // return [handType, [card1,card2,card3,card4,card5], weight]
};

HandAnalyzer.prototype.isStraightFlush = function(straightCardRank, flushCardSuit) {
console.log(straightCardRank, flushCardSuit)
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
        return trips + _.chain(pairs).without(trips).last();
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

    if (flush)
        return flushSuit;
    else
        return false;
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
            straight = i + 4; // return high-end
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

HandAnalyzer.prototype.handTypes = {
    0: 'High card',
    1: 'One Pair',
    2: 'Two Pair',
    3: 'Three of a kind',
    4: 'Straight',
    5: 'Flush',
    6: 'Full house',
    7: 'Four of a kind',
    8: 'Straight flush',
    9: 'Royal flush'
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
        rank = int;
    }
    return rank
};

module.exports = HandAnalyzer;