var HandAnalyzer = function(board) {
    this.board = board;
    this.boardAsString = this.handToString(this.board);
};

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

HandAnalyzer.prototype.handToString = function(hand) {
    var handToString = '';
    Object.keys(hand).forEach(function(card) {
        handToString += card.toString();
    });

    return handToString;
};

HandAnalyzer.prototype.isFlush = function(handString) {
    var flushRegex = //
};

HandAnalyzer.prototype.analyze = function(hand) {
    this.allCards = this.boardAsString + this.handToString(hand);
};