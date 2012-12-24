var Card = function(rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.dealt = false;
    this.weight = this.rankToInt();
};

Card.prototype.toString = function() {
    return this.rank + this.suit;
};

Card.prototype.rankToInt = function() {
	var rank;

	switch(this.rank) {
	case 'T':
		rank = 10;
		break;
	case 'J':
		rank = 11;
		break;
	case 'Q':
		rank = 12;
		break;
	case 'K':
		rank = 13;
		break;
	case 'A':
		rank = 14;
		break;
	default:
		rank = +this.rank;
	}

	return rank;
}

module.exports = Card;