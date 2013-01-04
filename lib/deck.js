var Card = require('./card');
var Cards = require('./cards');

var Deck = function() {
    var card;
    this.deck = [];
    this.dealtCount = 0;

    for (var i = 0; i < 52; i++) {
        card = this.cardMap[i];
        this.deck[i] = new Card(card.substring(0, 1), card.substring(1, 2));
    }
};

Deck.prototype.cardMap = [
    '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd', 'Ad',
    '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc', 'Ac',
    '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh', 'Ah',
    '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks', 'As'
];

Deck.prototype.dealCard = function() {
    var rand, card;

    if (this.dealtCount >= 52) {
        throw new Error('All cards have been dealt');
    }
     
    do {
        rand = Math.floor(Math.random() * 52);
        card = this.deck[rand];
    }
    while (card.dealt);

    card.dealt = true;
    this.dealtCount++;
    return card;
};

Deck.prototype.dealCards = function(numCards) {
    var cards = [];
    for (var i = 0, len = numCards; i < len; i++) {
        cards.push(this.dealCard());
    }
    return new Cards(cards);
};

Deck.prototype.reset = function() {
    for (var i = 0; i < 52; i++) {
        this.deck[i].dealt = false;
    }
    this.dealtCount = 0;
};

module.exports = Deck;
