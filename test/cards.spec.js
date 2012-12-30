var Card = require('../lib/card.js');
var Cards = require('../lib/cards.js');

describe('Cards: [As, 2s]', function() {
    var cards;
    beforeEach(function() {
        var card1 = new Card('A', 's');
        var card2 = new Card('2', 's');
        cards = new Cards([card1, card2]);
    });

    it('has a printed form of [As, 2s]', function() {
        expect(cards.print()).toEqual(['As', '2s']);
    });
    it('has a string form of As2s', function() {
        expect(cards.toString()).toEqual('As2s');
    });
    it('can make a clone', function() {
        expect(cards.clone()).toEqual(cards);
    });
    it('can merge with another Cards object', function() {
        var otherCards = new Cards('Tc9sJh');
        expect(cards.merge(otherCards).toString()).toEqual('As2sTc9sJh');
    });
    it('can reduce itself to an integer', function() {
        var reduceCallback = function(weight, card) {
            weight += card.weight;
            return weight;
        };
        expect(cards.reduce(reduceCallback)).toEqual(16);
    });
    it('can be spliced', function() {
        expect(cards.splice(-1, 1).toString()).toEqual('2s');
        expect(cards.splice(0, 1).toString()).toEqual('As');
        expect(cards.toArray()).toEqual([]);
    });
    it('can be spliced by rank', function() {
        expect(cards.spliceByRank('2').toString()).toEqual('2s');
        expect(cards.spliceByRank('A').toString()).toEqual('As');
    });
    it('will contain an empty array if spliced by a rank that isn\'t present', function() {
        expect(cards.spliceByRank('3').toArray()).toEqual([]);
    });
    it('can be spliced by suit', function() {
        expect(cards.spliceBySuit('s').toString()).toEqual('As2s');
    });
    it('will contain an empty array if spliced by a suit that isn\'t present', function() {
        expect(cards.spliceBySuit('c').toArray()).toEqual([]);
    });
});

describe('Cards: [2s, 3s, 4s, 5s, 9s, Ts, As]', function() {
    var cards;
    beforeEach(function() {
        cards = new Cards('2s3s4s5s9sTsAs');
    });

    it('can pull out a 5 high straight', function() {
        expect(cards.spliceStraight('5').toString()).toEqual('As2s3s4s5s');
    });
    it('can pull out an Ace high flush', function() {
        expect(cards.spliceFlush('s').toString()).toEqual('4s5s9sTsAs');
    });
});

describe('Cards: [8d, 9d, Td, Jd, Qd, Kd, Ad]', function() {
    var cards;
    beforeEach(function() {
        cards = new Cards('8d9dTdJdQdKdAd');
    });

    it('can pull out an Ace high straight', function() {
        expect(cards.spliceStraight('A').toString()).toEqual('TdJdQdKdAd');
    });
    it('can pull out an Ace high flush', function() {
        expect(cards.spliceFlush('d').toString()).toEqual('TdJdQdKdAd');
    });
});

describe('Cards: [9d,2h,Ac,4s,7s,Qh,Jh]', function() {
    var cards = new Cards('9d2hAc4s7sQhJh');
    it('can be sorted', function() {
        expect(cards.sort().toString()).toEqual('2h4s7s9dJhQhAc');
    });
});

