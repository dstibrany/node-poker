var _ = require('./utils.js')._;

// @param {{Cards}}
var HandAnalyzer = function(board) {
    // Parse cards in board and cache results for reuse
    this.board = board.sort();
    this.boardCount = new HandCount(this.board.toString());
};

HandAnalyzer.prototype.newHand = function(hand) {
    var handCount = new HandCount(hand.toString());
    this.madeHands = {}; // maps to this.handRankings
    // for (var i = 0; i < 8; i++) {
    //     this.madeHands[i] = {
    //         made: false,
    //         hand: [],
    //         handRanking: this.handTypes[i],
    //         weight: 0
    //     }
    // }
    return handCount;
};

// @param {{Cards}}
HandAnalyzer.prototype.analyze = function(hand) {
    // combine hand counts for board and players hand
    this.playersHandCount = this.newHand(hand);
    this.handCount = this.boardCount.combine(this.playersHandCount);
    // create sorted hand of all 7 cards
    this.allCards = hand.merge(this.board).sort();

    // return [handType, [card1,card2,card3,card4,card5], weight]
};

HandAnalyzer.prototype.isFlush = function() {
    var flushSuit;
    var suitCount = this.handCount.suitCount;
    var flush =  Object.keys(suitCount).some(function(suit) {
        flushSuit = suit;
        return suitCount[suit] === 5;
    });

    if (flush)
        return flushSuit;
    else
        return false;
};

// @return rank of low end of straight if there is a straight; false otherwise
HandAnalyzer.prototype.isStraight = function() {
    var rankCount = this.handCount.rankCount;
    var intToRank = this.handCount.intToRank;
    var straightCounter = 0;
    var straight = false;

    // 14 is the rank of an Ace
    for (var i = 14; i >= 2; i--) {
        if (rankCount[intToRank(i)] > 0)
            straightCounter++
        else
            straightCounter = 0;

        if (straightCounter === 5) {
            straight = i;
            break;
        }
    }
    return straight;
};

HandAnalyzer.prototype.parseHandRanks = function() {
    var rankCount = this.rankCount;
    for (var i = 0, len = rankCount; i < len; i++) {
        switch(rankCount[i]) {
        case 4:
            this.madeHands[7].made = true;

            break;
        case 3:
            this.madeHands[3].made = true;

            break;
        case 2:
            this.madeHands[2].made = true;

            break;
        case 1:
            this.madeHands[1].made = true;

            break;    
        }
    };
};

HandAnalyzer.prototype.getWinningHandByHandType = function(handType, rank, suit) {
    switch(handType) {
    case 7:


    }
}

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