var util = require('util');
var Dealer = require('./lib/dealer.js');
var HandAnalyzer = require('./lib/handAnalyzer.js');
var numCards = process.argv[2] || 1;

var dealer = new Dealer();
var board = dealer.dealCards(5);
var hand = dealer.dealCards(2);
console.log(hand.print(), board.print())

// var spliced = allCards.splice(-3);
// console.log("Spliced: ", spliced.print())
// console.log("Remaining cards:", allCards.print());


var handAnalyzer = new HandAnalyzer(board);
var count = 0;
do {
    var hand1 = dealer.dealCards(2);
    count++;
    handAnalyzer.analyze(hand1);
    console.log('Cards ', board.print(), hand1.print());
}
while (!handAnalyzer.isFlush());

console.log('Took %s deals', count);




