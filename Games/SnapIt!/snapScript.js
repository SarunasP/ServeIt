function Card(rank, suit) {
	this.rank = rank;
	this.suit = suit;
	this.toString   = cardToString;
	this.createNode = cardCreateNode;
}

/** Transfers the Card to a String
*	@return {String} Card defining the rank and suit.
*/

function cardToString() {
	var rank, suit;
	
  switch (this.rank) {
    case "A" :
		rank = "a";
		break;
    case "2" :
		rank = "2";
		break;
    case "3" :
		rank = "3"; 
		break;
    case "4" :
		rank = "4";
		break;
    case "5" :
		rank = "5";
		break;
    case "6" :
		rank = "6";
		break;
    case "7" :
		rank = "7";
		break;
    case "8" :
		rank = "8";
		break;
    case "9" :
		rank = "9";
		break;
    case "10" :
		rank = "10";
		break;
    case "J" :
		rank = "j"
		break;
    case "Q" :
		rank = "q"
		break;
    case "K" :
		rank = "k"
		break;
    default :
		rank = null;
		break;
  }

  switch (this.suit) {
    case "C" :
		suit = "clubs";
		break;
    case "D" :
		suit = "diamonds"
		break;
    case "H" :
		suit = "hearts"
		break;
    case "S" :
		suit = "spades"
		break;
	default :
		suit = null;
		break;
	}

	if (rank == null || suit == null)
		return "";

	return "card card-"+ suit + " card-" + rank;
}

function cardCreateNode() {
	var cardNode;
	cardNode = document.createElement("DIV");
	cardNode.className = "card";
	return cardNode;
}

// Stack constructor function.

function Stack() {

  // Create an empty array of deck.
	this.deck = new Array();
	
	this.getCard   	 	= stackGetCard;
	this.getRank   	 	= stackGetRank;
	this.makeDeck  	 	= stackMakeDeck;
	this.shuffle   	 	= stackShuffle;
	this.deal      	 	= stackDeal;
	this.draw      	 	= stackDraw;
	this.addCard  	 	= stackAddCard;
	this.combine   	 	= stackCombine;
	this.cardCount   	= stackCardCount;
	this.compare        = stackCompare;
	this.getLastElement = stackGetLastElement;
}


/** Compares the ranks of two deck
*	@param card1{String} String version of the first card.
*	@param card2{String} String version of the second card.
*	@return {Bool} Whether the two ranks are the same.
*/

function stackCompare(card1, card2) {
	console.log(stackGetRank(card1));
	console.log(stackGetRank(card2));
	return (stackGetRank(card1) == stackGetRank(card2));
}	

/** Retrieves the rank of a card string
*	@param {String} card1
*	@return {String} The initial part of the card string, the rank.
*/

function stackGetRank(card) {
	var n = String(card);
	return n.split("-")[2];
}

//Creates a deck. The parameter defines the number of decks that will be created.

function stackMakeDeck(amountOfDecks) {

	var suits = new Array("C", "D", "H", "S");
	var ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K");
	var i, suitNav, rankNav, totalCards, position;

	totalCards = 52; 
	this.deck = new Array(amountOfDecks * totalCards);
	i = 0;
	
	while (i < amountOfDecks){	
		for (suitNav = 0; suitNav < suits.length; suitNav++){
			for (rankNav = 0; rankNav < ranks.length; rankNav++){
			
				position = i * totalCards + suitNav * ranks.length + rankNav
				this.deck[position] = new Card(ranks[rankNav], suits[suitNav]);
			}
		}
	i++;
	}
}

//Shuffles the deck given through use of Math.random.
function stackShuffle() {
	
	var j, k, shuffler;
	
	for (j = 0; j < this.deck.length; j++) {
			
		k = Math.floor(Math.random() * this.deck.length);
		shuffler = this.deck[j];
		this.deck[j] = this.deck[k];
		this.deck[k] = shuffler;
	}
}

/** Combines the deck of two stacks.
*	@param {Stack} stack
*	@return void
*/

function stackDeal() {
	if (this.deck.length > 0)
		return this.deck.shift();
	else
		return "No Card in Hand!";
}

/** Combines the deck of two stacks.
*	@param {Stack} stack
*	@return void
*/

function stackGetCard(n) {
	if (this.deck.length > 0)
		return this.deck[n];
	else
		return "No Card in Hand!";
}

/** Combines the deck of two stacks.
*	@param {Stack} stack
*	@return void
*/// stackDraw(n): Removes the indicated card from the stack and returns it.

function stackDraw(numDraws) {
	var card;
	if (numDraws >= 0 && numDraws < this.deck.length) {
		card = this.deck[numDraws];
		this.deck.splice(numDraws, 0);
	} else {
		card = null;
	}
	return card;
}

function stackAddCard(card) {
	this.deck.push(card);
}

/** Combines the deck of two stacks.
*	@param {Stack} stack
*	@return void
*/
function stackCombine(stack) {
	this.deck = this.deck.concat(stack.deck);
	stack.deck = new Array();
	var i = stack.deck.indexOf("No Card in Hand!");
	while(i > -1) {
		stack.deck.splice(i,1);
		i = stack.deck.indexOf("No Card in Hand!");
	}
}

function stackGetLastElement() {
	
	return this.deck.pop();
}

/** Combines the deck of two stacks.
*	@param {Stack} stack
*/

function stackCardCount() {
	return this.deck.length;
}