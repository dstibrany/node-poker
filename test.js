var util = require('util');
var Dealer = require('./lib/dealer.js');
var HandAnalyzer = require('./lib/handAnalyzer.js');
var numCards = process.argv[2] || 1;

var dealer = new Dealer();
var board = dealer.dealCards(5);

console.log(board.sort().print());

var spliced = board.splice('A');
console.log("Spliced: ", spliced.print());
console.log("board:", board.print());


// var handAnalyzer = new HandAnalyzer(board);

// do {
//     var hand1 = dealer.dealCards(2);
//     count++;
//     handAnalyzer.analyze(hand1);
//     console.log('Cards ', board.print(), hand1.print());
// }
// while (!handAnalyzer.isFlush());

// console.log(util.inspect(handAnalyzer));
// console.log('Took %s deals', count);




