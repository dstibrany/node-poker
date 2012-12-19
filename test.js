var util = require('util');
var Dealer = require('./lib/dealer.js');
var Cards = require('./lib/cards.js');
var HandAnalyzer = require('./lib/handAnalyzer.js');
var numCards = process.argv[2] || 1;

var dealer = new Dealer();
var board = dealer.dealCards(5);
var hand = dealer.dealCards(2);
// var board = new Cards('6h5hTdQd4h')
// var hand = new Cards('2h3h')
console.log('Hand:', hand.print());
console.log('Board:', board.print());

var handAnalyzer = new HandAnalyzer(board);
var finalHand = handAnalyzer.analyze(hand);
console.log('\nResults:', finalHand.handType, finalHand.finalHand.print());
// console.log(handAnalyzer.isFullHouse())
// console.log(handAnalyzer.isTwoPair())

// var count = 0;
// var lowEnd;
// do {
//     var hand1 = dealer.dealCards(2);
//     count++;
//     handAnalyzer.analyze(hand1);
//     console.log('Cards ', board.print(), hand1.print());
// }
// while (!handAnalyzer.isStraight());
// console.log(handAnalyzer.allCards.spliceStraight(handAnalyzer.isStraight()).print());
// console.log('Took %s deals', count);




