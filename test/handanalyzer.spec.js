var Cards = require('../lib/cards.js');
var HandAnalyzer = require('../lib/HandAnalyzer.js');

describe('A board: [7s, 8c, 2c, Qd, Jh, 7c, 7d]', function() {
    var ha = new HandAnalyzer(new Cards('7s8c2cQdJh7c7d'));
    it('should have an accurate suit count', function() {
        expect(ha.boardCount.suitCount['s']).toBe(1);
        expect(ha.boardCount.suitCount['c']).toBe(3);
        expect(ha.boardCount.suitCount['h']).toBe(1);
        expect(ha.boardCount.suitCount['d']).toBe(2);
    });
    it('should have an accurate rank count', function() {
        expect(ha.boardCount.rankCount['2']).toBe(1);
        expect(ha.boardCount.rankCount['3']).toBe(0);
        expect(ha.boardCount.rankCount['4']).toBe(0);
        expect(ha.boardCount.rankCount['5']).toBe(0);
        expect(ha.boardCount.rankCount['6']).toBe(0);
        expect(ha.boardCount.rankCount['7']).toBe(3);
        expect(ha.boardCount.rankCount['8']).toBe(1);
        expect(ha.boardCount.rankCount['9']).toBe(0);
        expect(ha.boardCount.rankCount['T']).toBe(0);
        expect(ha.boardCount.rankCount['J']).toBe(1);
        expect(ha.boardCount.rankCount['Q']).toBe(1);
        expect(ha.boardCount.rankCount['K']).toBe(0);
        expect(ha.boardCount.rankCount['A']).toBe(0);
    });
});

describe('On a board of: [4s, Qh, Kc, Kh, Jh]', function() {
    var ha = new HandAnalyzer(new Cards('4sQhKcKhJh')); 
    describe('With cards: [Ah,Th]', function() {
        var results = ha.analyze(new Cards('AhTh'));
        it('There is a Royal Flush', function() {
            expect(results.handType).toEqual('Royal flush');
            expect(results.hand.toString()).toEqual('ThJhQhKhAh');
        });
    });

    describe('With cards: [9h,Th]', function() {
        var results = ha.analyze(new Cards('9hTh'));
        it('There is a King high straight flush', function() {
            expect(results.handType).toEqual('Straight flush');
            expect(results.hand.toString()).toEqual('9hThJhQhKh');
        });
    });

    describe('With cards: [Ks,Kd]', function() {
        var results = ha.analyze(new Cards('KsKd'));
        it('There are four Kings with an Queen kicker', function() {
            expect(results.handType).toEqual('Four of a kind');
            expect(results.hand.toString()).toEqual('KsKdKcKhQh');
        });
    });

    describe('With cards: [Ks,Qd]', function() {
        var results = ha.analyze(new Cards('KsQd'));
        it('There is a Full house, kings over queens', function() {
            expect(results.handType).toEqual('Full house');
            expect(results.hand.toString()).toEqual('KsKcKhQdQh');
        });
    });

    describe('With cards: [2h,3h]', function() {
        var results = ha.analyze(new Cards('2h3h'));
        it('There is a King high flush', function() {
            expect(results.handType).toEqual('Flush');
            expect(results.hand.toString()).toEqual('2h3hJhQhKh');
        });
    });

    describe('With cards: [Ad,Ts]', function() {
        var results = ha.analyze(new Cards('AdTs'));
        it('There is an Ace high straight', function() {
            expect(results.handType).toEqual('Straight');
            expect(results.hand.toString()).toEqual('TsJhQhKcAd');
        });
    });

    describe('With cards: [Ks,2s]', function() {
        var results = ha.analyze(new Cards('Ks2s'));
        it('There is trip Kings', function() {
            expect(results.handType).toEqual('Three of a kind');
            expect(results.hand.toString()).toEqual('KsKcKhJhQh');
        });
    });

    describe('With cards: [Js,2h]', function() {
        var results = ha.analyze(new Cards('Js4h'));
        it('There is two pairs, Kings and Jacks', function() {
            expect(results.handType).toEqual('Two pairs');
            expect(results.hand.toString()).toEqual('KcKhJsJhQh');
        });
    });

    describe('With cards: [9s,2h]', function() {
        var results = ha.analyze(new Cards('9s2h'));
        it('There is a pair of Kings', function() {
            expect(results.handType).toEqual('Pair');
            expect(results.hand.toString()).toEqual('KcKh9sJhQh');
        });
    });

});

describe('Testing Hand Type Values', function() {
    var ha = new HandAnalyzer(new Cards(''));
    it('A pair beats a high card', function() {
        var hand1 = ha.analyze(new Cards('AsAdTc9s2d'));
        var hand2 = ha.analyze(new Cards('Ac3dTs9d2h'));
        expect(hand1.handType).toEqual('Pair');
        expect(hand2.handType).toEqual('High card');
        expect(hand1.handTypeValue).toBeGreaterThan(hand2.handTypeValue);
    }); 
    it('Two Pairs beats a Pair', function() {
        var hand1 = ha.analyze(new Cards('AsAdTcTs2d'));
        var hand2 = ha.analyze(new Cards('AcAhTs9d2h'));
        expect(hand1.handType).toEqual('Two pairs');
        expect(hand2.handType).toEqual('Pair');
        expect(hand1.handTypeValue).toBeGreaterThan(hand2.handTypeValue);
    }); 
    it('Trips beats Two Pairs', function() {
        var hand1 = ha.analyze(new Cards('AsAdAcTs2d'));
        var hand2 = ha.analyze(new Cards('2c2hTdTd3h'));
        expect(hand1.handType).toEqual('Three of a kind');
        expect(hand2.handType).toEqual('Two pairs');
        expect(hand1.handTypeValue).toBeGreaterThan(hand2.handTypeValue);
    });
    it('A Straight beats Trips', function() {
        var hand1 = ha.analyze(new Cards('As2d3c4s5d'));
        var hand2 = ha.analyze(new Cards('2c2h2sTd3h'));
        expect(hand1.handType).toEqual('Straight');
        expect(hand2.handType).toEqual('Three of a kind');
        expect(hand1.handTypeValue).toBeGreaterThan(hand2.handTypeValue);
    }); 
    it('A Flush beats a Straight', function() {
        var hand1 = ha.analyze(new Cards('2hJh3h5h8h'));
        var hand2 = ha.analyze(new Cards('6s2d3c4s5d'));
        expect(hand1.handType).toEqual('Flush');
        expect(hand2.handType).toEqual('Straight');
        expect(hand1.handTypeValue).toBeGreaterThan(hand2.handTypeValue);
    });
    it('A Full house beats a Flush', function() {
        var hand1 = ha.analyze(new Cards('6s6d6c4s4d'));
        var hand2 = ha.analyze(new Cards('2hJh3h5h8h'));
        expect(hand1.handType).toEqual('Full house');
        expect(hand2.handType).toEqual('Flush');
        expect(hand1.handTypeValue).toBeGreaterThan(hand2.handTypeValue);
    });
    it('Four of a kind beats a Full house', function() {
        var hand1 = ha.analyze(new Cards('2h2s2d2c8h'));
        var hand2 = ha.analyze(new Cards('6s6d6c4s4d'));
        expect(hand1.handType).toEqual('Four of a kind');
        expect(hand2.handType).toEqual('Full house');
        expect(hand1.handTypeValue).toBeGreaterThan(hand2.handTypeValue);
    }); 
    it('A Straight flush beats Four of a kind', function() {
        var hand1 = ha.analyze(new Cards('2h3h4h5h6h'));
        var hand2 = ha.analyze(new Cards('7s7d7c7h4d'));
        expect(hand1.handType).toEqual('Straight flush');
        expect(hand2.handType).toEqual('Four of a kind');
        expect(hand1.handTypeValue).toBeGreaterThan(hand2.handTypeValue);
    });
    it('A Royal flush beats a Straight flush', function() {
        var hand1 = ha.analyze(new Cards('TsJsQsKsAs'));
        var hand2 = ha.analyze(new Cards('2h3h4h5hAh'));
        expect(hand1.handType).toEqual('Royal flush');
        expect(hand2.handType).toEqual('Straight flush');
        expect(hand1.handTypeValue).toBeGreaterThan(hand2.handTypeValue);
    }); 
});





