' use strict '

var display = document.getElementById('display')

class Card {
  constructor (rank, suit, value) {
    this.rank = rank
    this.suit = suit
    this.value = value
    this.name = this.rank + ' of ' + this.suit
  }
}

class Deck {
  constructor (cards) {
    this.cards = cards
  }
  buildDeck () {
    this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    this.suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs']
    for (let s = 0; s < this.suits.length; s++) {
      for (let r = 0; r < this.ranks.length; r++) {
        this.cards.push(new Card(this.ranks[r], this.suits[s], r + 1))
      }
    }
    console.log('First card in the deck is ' + this.cards[0].name)
  }
  surrenderCard () {
    return this.cards.pop()
  }
}

class Dealer {
  constructor (deck, hand, playersHand) {
    this.deck = deck
    this.hand = hand
    this.playersHand = playersHand
  }
  dealCardsToPlayer (cardOne, cardTwo) {
    this.playersHand.push(cardOne)
    this.playersHand.push(cardTwo)
  }
  dealHandToSelf (cardOne, cardTwo) {
    this.hand = []
    this.hand.push(cardOne)
    this.hand.push(cardTwo)
  }
}

describe('deckSuite', function () {
  let deck = new Deck()
  deck.cards = []
  deck.buildDeck()
  it('deck has 52 cards in it', function () {
    expect(deck.cards.length).toBe(52)
  })
})

describe('testSurrenderCard', function () {
  let deck = new Deck()
  deck.cards = []
  deck.buildDeck()
  deck.surrenderCard()
  it('Card surrendered', function () {
    expect(deck.cards.length).toBe(51)
  })
})

describe('testDealCardToPlayer', function () {
  let dealer = new Dealer()
  let card = new Card(3, 3, 'SPADES')
  dealer.playersHand = []
  dealer.dealCardToPlayer(card)
  it('player recieved card', function () {
    expect(dealer.playersHand.length).toBe(1)
  })
})

describe('testDealHandToSelf', function () {
  let dealer = new Dealer()
  let cardOne = new Card('5', 'SPADES', 5)
  let cardTwo = new Card('K', 'DIAMONDS', 10)
  dealer.hand = []
  dealer.dealHandToSelf(cardOne, cardTwo)
  it('dealer recieved hand', function () {
    expect(dealer.hand.length).toBe(2)
  })
})

function play () {
  let hand = []
  let playersHand = []
  let cards = []
  let deck = new Deck(cards)
  deck.buildDeck()
  let dealer = new Dealer(deck, hand, playersHand)
  let dealerCard = deck.surrenderCard()
  dealer.dealHandToSelf(dealerCard)
  dealer.dealCardsToPlayer(deck.surrenderCard(), deck.surrenderCard())
  display.innerHTML += 'Dealers Hand: HIDDEN of HIDDEN and ' + dealer.hand[0].name
  display.innerHTML += 'Your Hand: ' + dealer.playersHand[0].name + ' and ' + dealer.playersHand[1].name
}
