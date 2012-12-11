var Dealer = require('./lib/dealer.js');
var dealer = new Dealer();
var numCards = process.argv[2] || 1;

var hand = dealer.dealCards(numCards);

var hand = hand.map(function(card) {
    return card.toString();
});

console.log(hand);
