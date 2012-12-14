var _ = require('./utils.js')._;

// @param {{Cards}}
var HandAnalyzer = function(board) {
    // Parse cards in board and cache results for reuse
    this.board = board.sort();

    this.suitCountForBoard = {
        'd': 0, 'c': 0,
        'h': 0, 's': 0
    };
    this.rankCountForBoard = {
        '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0,
        '9': 0, 'T': 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 0
    };

    this.parseBoard(this.board.toString());
};

HandAnalyzer.prototype.parseBoard = function(handStr) {
    this.parseHand(handStr, this.suitCountForBoard, this.rankCountForBoard);
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

HandAnalyzer.prototype.newHand = function() {
    this.suitCountForHand = {
        'd': 0, 'c': 0,
        'h': 0, 's': 0
    };
    this.rankCountForHand = {
        '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0,
        '9': 0, 'T': 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 0
    };
    // maps to this.handRankings
    this.madeHands = {};
    for (var i = 0; i < 8; i++) {
        this.madeHands[i] = {
            made: false,
            hand: [],
            handRanking: this.handTypes[i],
            weight: 0
        }
    }
};
    return combinedCount;
};

// @param {{Cards}}
HandAnalyzer.prototype.analyze = function(hand) {
    this.newHand();

    // parse players two cards and combine it with parsed board
    this.parseHand(hand.toString(), this.suitCountForHand, this.rankCountForHand);
    this.suitCountTotal = this.combineCount(this.suitCountForHand, this.suitCountForBoard);
    this.rankCountTotal = this.combineCount(this.rankCountForHand, this.rankCountForBoard);

    // create sorted hand of all 7 cards
    this.allCards = hand.merge(board).sort();

    // console.log('isflush: ', this.isFlush());
    // return [handType, [card1,card2,card3,card4,card5], weight]
};

HandAnalyzer.prototype.isFlush = function() {
    var self = this;
    return Object.keys(this.suitCountTotal).some(function(suit) {
        return self.suitCountTotal[suit] === 5;
    });
};

HandAnalyzer.prototype.isStraight = function() {
   
};

HandAnalyzer.prototype.parseHandRanks = function() {
    var rankCountTotal = this.rankCountTotal;
    for (var i = 0, len = rankCountTotal; i < len; i++) {
        switch(rankCountTotal[i]) {
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

HandAnalyzer.prototype.getWinningHandByHandType = function(handType) {
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

module.exports = HandAnalyzer;