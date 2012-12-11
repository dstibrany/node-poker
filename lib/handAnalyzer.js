var _ = require('./utils.js')._;

// @param {{Cards}}
var HandAnalyzer = function(board) {
    // Parse cards in board and cache results for reuse
    this.board = board;
    this.boardStr = this.board.toString();

    this.suitCountForBoard = {
        'd': 0, 'c': 0,
        'h': 0, 's': 0
    };
    this.rankCountForBoard = {
        '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0,
        '9': 0, 'T': 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 0
    };

    this.parseBoard();
};

HandAnalyzer.prototype.parseBoard = function() {
    this.parseHand(this.boardStr, this.suitCountForBoard, this.rankCountForBoard);
}

HandAnalyzer.prototype.parseHand = function(handStr, suitCountObj, rankCountObj) {
    for (var i = 0, len = handStr.length; i < len; i++) {
        if (_.isNumber(suitCountObj[handStr[i]]))
            suitCountObj[handStr[i]]++;
        else
            rankCountObj[handStr[i]]++;
    }
};

HandAnalyzer.prototype.combineCount = function(count1, count2) {
    var combinedCount = {};
    _.each(count1, function(value, key) { 
        combinedCount[key] = count1[key] + count2[key];
    });

    return combinedCount;
};

// @param {{Cards}}
HandAnalyzer.prototype.analyze = function(hand) {
    this.resetHandCount();

    // create string of all 7 cards
    this.handStr = hand.toString();
    this.allCardsStr = this.boardStr + this.handStr;

    // parse hand and combine with parsed board
    this.parseHand(this.handStr, this.suitCountForHand, this.rankCountForHand);
    this.suitCountTotal = this.combineCount(this.suitCountForHand, this.suitCountForBoard);
    this.rankCountTotal = this.combineCount(this.rankCountForHand, this.rankCountForBoard);

    // console.log('isflush: ', this.isFlush());
};

HandAnalyzer.prototype.isFlush = function() {
    var self = this;
    return Object.keys(this.suitCountTotal).some(function(suit) {
        return self.suitCountTotal[suit] === 5;
    });
};

HandAnalyzer.prototype.resetHandCount = function() {
    this.suitCountForHand = {
        'd': 0, 'c': 0,
        'h': 0, 's': 0
    };
    this.rankCountForHand = {
        '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0,
        '9': 0, 'T': 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 0
    };
}

HandAnalyzer.prototype.handRankings = {
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

module.exports = HandAnalyzer;