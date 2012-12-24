var util = require('util');
var Dealer = require('./lib/dealer.js');
var Cards = require('./lib/cards.js');
var HandAnalyzer = require('./lib/handAnalyzer.js');
var numCards = process.argv[2] || 1;

var dealer = new Dealer();
// var board = dealer.dealCards(5);
// var hand = dealer.dealCards(2);
// var hand2 = dealer.dealCards(2);

board = new Cards([]);
hand = new Cards('As2d3d4d5d');


// console.log('Boo Hand:', hand.print());
// console.log('Pokey Hand:', hand2.print());
// console.log('Board:', board.print());

var handAnalyzer = new HandAnalyzer(board);
var finalHand = handAnalyzer.analyze(hand);
// var finalHand2 = handAnalyzer.analyze(hand2);
console.log(finalHand.handType, finalHand.hand.print(), finalHand.weight);
// console.log('Pokey Results:', finalHand2.handType, finalHand2.hand.print(), finalHand2.weight);

// if (finalHand.weight > finalHand2.weight)
//     console.log('\nBoo Wins!');
// else if (finalHand.weight < finalHand2.weight)
//     console.log('\nPokey Wins!');
// else
//     console.log('\nSplit pot');

// inspect blow up
/* Boo Hand: [ '4s', '9h' ]
   Pokey Hand: [ '2d', 'As' ]
   Board: [ 'Ah', '3c', '8d', '2s', '5h' ]
*/











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




