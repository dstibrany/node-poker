var _ = require('lodash');
var Deck = require('../lib/deck.js');

describe('A Deck', function() {
    var deck = new Deck();

    it('has 52 cards', function() {
        expect(deck.deck.length).toEqual(52);
    });
    it('starts with 52 undealt cards', function() {
        var allCardsUndealt = true;
        for (var i = 0; i < 52; i++) {
            if (deck.deck[i].dealt === true)
                allCardsUndealt = false;
        }
        expect(allCardsUndealt).toBe(true);
    });
    it('will have all 52 cards marked as dealt if we deal 52 cards', function() {
        var allCardsDealt = true;
        for (var i = 0; i < 52; i++) {
            deck.dealCard();
        }
        for (var j = 0; i < 52; i++) {
            if (deck.deck[j].dealt === false)
                allCardsDealt = false;
        }
        expect(allCardsDealt).toBe(true);

    });
    it('cannot deal more than 52 cards', function() {
        expect(_.bind(deck.dealCard, deck)).toThrow('All cards have been dealt');
    });
    it('can be reset', function() {
        var allCardsUndealt = true;
        deck.reset();
        for (var i = 0; i < 52; i++) {
            if (deck.deck[i].dealt === true)
                allCardsUndealt = false;
        }
        expect(allCardsUndealt).toBe(true);
    });
});