var StateMachine = require('../lib/statemachine');
var limit = 5;

describe("A state machine with a limit of " + limit, function() {
    var stateMachine = new StateMachine(5);
    it("has a first state called 'preflop'", function() {
        expect(stateMachine.getState()).toBe('preflop');
    });
    it("with a bet amount of " + (limit / 2), function() {
        expect(stateMachine.betAmount).toBe(limit / 2);
    });
    it("has a 2nd state called 'flop'", function() {
        stateMachine.nextState();
        expect(stateMachine.getState()).toBe('flop');
    });
    it("with a bet amount of " + (limit / 2), function() {
        expect(stateMachine.betAmount).toBe(limit / 2);
    });
    it("has a 3rd state called 'turn'", function() {
        stateMachine.nextState();
        expect(stateMachine.getState()).toBe('turn');
    });
    it("with a bet amount of " + (limit), function() {
        expect(stateMachine.betAmount).toBe(limit);
    });
    it("has a 4th state called 'river'", function() {
        stateMachine.nextState();
        expect(stateMachine.getState()).toBe('river');
    });
    it("with a bet amount of " + (limit), function() {
        expect(stateMachine.betAmount).toBe(limit);
    });
    it("has a 5th state called 'showdown'", function() {
        stateMachine.nextState();
        expect(stateMachine.getState()).toBe('showdown');
    });
    it("will reset back to 'preflop' after state 'showdown'", function() {
        stateMachine.nextState();
        expect(stateMachine.getState()).toBe('preflop');
    });
    it("with a bet amount of " + (limit / 2), function() {
        expect(stateMachine.betAmount).toBe(limit / 2);
    });
    it("has a next state called 'flop'", function() {
        stateMachine.nextState();
        expect(stateMachine.getState()).toBe('flop');
    });
    it("can be reset back to state preflop at any time with a", function() {
        stateMachine.reset();
        expect(stateMachine.getState()).toBe('preflop');
    });
    it("can be reset with the correct bet amount of " + (limit / 2), function() {
        expect(stateMachine.betAmount).toBe(limit / 2);
    });
});