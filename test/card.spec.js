var Card = require('../lib/card.js');

var card = new Card(6, 's');
var card2 = new Card('T', 'c');
var card3 = new Card('A', 'd');

describe('Card: Six of spades', function() {
    it('has a rank of 6', function() {
        expect(card.rank).toEqual(6);
    });
    it('has a suit of s', function() {
        expect(card.suit).toEqual('s');
    });
    it('has a weight of 6', function() {
        expect(card.weight).toEqual(6);
    });
    it('can be converted to a string of value 6s', function() {
        expect(card.toString()).toEqual('6s');
    });
});

describe('Card: Ten of clubs', function() {
    it('has a rank of T', function() {
        expect(card2.rank).toEqual('T');
    });
    it('has a suit of c', function() {
        expect(card2.suit).toEqual('c');
    });
    it('has a weight of 10', function() {
        expect(card2.weight).toEqual(10);
    });
    it('can be converted to a string of value Tc', function() {
        expect(card2.toString()).toEqual('Tc');
    });
});

describe('Card: Ace of diamonds', function() {
    it('has a rank of A', function() {
        expect(card3.rank).toEqual('A');
    });
    it('has a suit of d', function() {
        expect(card3.suit).toEqual('d');
    });
    it('has a weight of 6', function() {
        expect(card3.weight).toEqual(14);
    });
    it('can be converted to a string of value Ad', function() {
        expect(card3.toString()).toEqual('Ad');
    });
});