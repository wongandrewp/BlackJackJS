' use strict '

var display = document.getElementById('display')

class Card {
  constructor (rank, suit, value) {
    this.rank = rank
    this.suit = suit
    this.value = value
    if (this.rank === 'A') {
      this.value = 11
      this.isAce = true
    } else { this.isAce = false }
    if (this.value > 10 && this.isAce === false) {
      this.value = 10
    }
    this.name = this.rank + ' of ' + this.suit
  }
}

class Deck {
  constructor () {
    this.cards = []
  }
  buildDeck () {
    this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    this.suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs']
    for (let s = 0; s < this.suits.length; s++) {
      for (let r = 0; r < this.ranks.length; r++) {
        this.cards.push(new Card(this.ranks[r], this.suits[s], r + 1))
      }
    }
    this.shuffle()
  }
  surrenderCard () {
    return this.cards.pop()
  }
  shuffle () {
    var j, x, i
    for (i = this.cards.length; i; i--) {
      j = Math.floor(Math.random() * i)
      x = this.cards[i - 1]
      this.cards[i - 1] = this.cards[j]
      this.cards[j] = x
    }
  }
}

class Dealer {
  constructor (deck) {
    this.deck = deck
  }
  dealHandToPlayer () {
    this.playersHand = []
    this.playersHand.push(this.deck.surrenderCard())
    this.playersHand.push(this.deck.surrenderCard())
  }
  dealHandToSelf () {
    this.hand = []
    this.hand.push(this.deck.surrenderCard())
    this.hand.push(this.deck.surrenderCard())
  }
  calculatePlayersHandValue () {
    let value = 0
    for (let i = 0; i < this.playersHand.length; i++) {
      value += this.playersHand[i].value
    }
    return value
  }
  calculateDealersHandValue () {
    let value = 0
    for (let i = 0; i < this.hand.length; i++) {
      value += this.hand[i].value
    }
    return value
  }
  playerBusted () {
    if (this.calculatePlayersHandValue() > 21) {
      return true
    } else return false
  }
  playerHit21 () {
    if (this.calculatePlayersHandValue() === 21) {
      return true
    } else return false
  }
  takeTurn () {
    while (this.calculateDealersHandValue() < 17) {
      this.hand.push(this.deck.surrenderCard())
    }
  }
  dealerBusted () {
    if (this.calculateDealersHandValue() > 21) {
      return true
    } else return false
  }
  dealerHit21 () {
    if (this.calculateDealersHandValue() === 21) {
      return true
    } else return false
  }
  determineWinner () {
    let pHand = this.calculatePlayersHandValue()
    let dHand = this.calculateDealersHandValue()
    if (pHand > dHand) {
      return 'player'
    } else return 'dealer'
  }
}

describe('deckSuite', function () {
  let deck = new Deck()
  deck.buildDeck()
  it('deck has 52 cards in it', function () {
    expect(deck.cards.length).toBe(52)
  })
})

describe('testSurrenderCard', function () {
  let deck = new Deck()
  deck.buildDeck()
  deck.surrenderCard()
  it('Card surrendered', function () {
    expect(deck.cards.length).toBe(51)
  })
})

describe('testDealCardsToPlayer', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.dealHandToPlayer()
  it('player recieved card', function () {
    expect(dealer.playersHand.length).toBe(2)
  })
})

describe('testDealHandToSelf', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.dealHandToSelf()
  it('dealer recieved hand', function () {
    expect(dealer.hand.length).toBe(2)
  })
})

describe('testCalculatePlayersHand', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.playersHand = []
  dealer.playersHand.push(new Card('2', 'SPADES', 2))
  dealer.playersHand.push(new Card('10', 'SPADES', 10))
  let value = dealer.calculatePlayersHandValue()
  it('Players and value', function () {
    expect(value).toBe(12)
  })
})

describe('testCalculateDealersHand', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.hand = []
  dealer.hand.push(new Card('5', 'DIAMONDS', 5))
  dealer.hand.push(new Card('10', 'SPADES', 10))
  let value = dealer.calculateDealersHandValue()
  it('Players and value', function () {
    expect(value).toBe(15)
  })
})

describe('testPlayerBusted', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.playersHand = []
  dealer.playersHand.push(new Card('2', 'SPADES', 2))
  dealer.playersHand.push(new Card('10', 'SPADES', 10))
  dealer.playersHand.push(new Card('10', 'HEARTS', 10))
  it('player busted', function () {
    expect(dealer.playerBusted()).toBe(true)
  })
})

describe('testPlayerBusted', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.playersHand = []
  dealer.playersHand.push(new Card('10', 'HEARTS', 10))
  dealer.playersHand.push(new Card('10', 'SPADES', 10))
  it('player did not bust', function () {
    expect(dealer.playerBusted()).toBe(false)
  })
})

describe('testPlayerHit21', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.playersHand = []
  dealer.playersHand.push(new Card('A', 'HEARTS', 11))
  dealer.playersHand.push(new Card('10', 'SPADES', 10))
  it('player hit blackjack', function () {
    expect(dealer.playerHit21()).toBe(true)
  })
})

describe('testPlayerHit21', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.playersHand = []
  dealer.playersHand.push(new Card('A', 'HEARTS', 11))
  dealer.playersHand.push(new Card('9', 'SPADES', 9))
  it('player hit blackjack', function () {
    expect(dealer.playerHit21()).toBe(false)
  })
})

describe('testDealerBusted', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.hand = []
  dealer.hand.push(new Card('2', 'SPADES', 2))
  dealer.hand.push(new Card('10', 'SPADES', 10))
  dealer.hand.push(new Card('10', 'HEARTS', 10))
  it('dealer busted', function () {
    expect(dealer.dealerBusted()).toBe(true)
  })
})

describe('testDealerBusted', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.hand = []
  dealer.hand.push(new Card('10', 'HEARTS', 10))
  dealer.hand.push(new Card('10', 'SPADES', 10))
  it('dealer did not bust', function () {
    expect(dealer.dealerBusted()).toBe(false)
  })
})

describe('testDealerHit21', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)

  dealer.hand = []
  dealer.hand.push(new Card('A', 'HEARTS', 11))
  dealer.hand.push(new Card('10', 'SPADES', 10))
  it('dealer hit blackjack', function () {
    expect(dealer.dealerHit21()).toBe(true)
  })
})

describe('testDealerHit21', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.hand = []
  dealer.hand.push(new Card('A', 'HEARTS', 11))
  dealer.hand.push(new Card('9', 'SPADES', 9))
  it('dealer did not hit blackjack', function () {
    expect(dealer.dealerHit21()).toBe(false)
  })
})

describe('testTakeTurn', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.dealHandToSelf()
  dealer.takeTurn()
  it('dealer has taken turn', function () {
    expect(dealer.calculateDealersHandValue() > 16).toBeTruthy()
  })
})

describe('testDetermineWinner', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.hand = []
  dealer.hand.push(new Card('A', 'HEARTS', 11))
  dealer.hand.push(new Card('9', 'SPADES', 9))
  dealer.playersHand = []
  dealer.playersHand.push(new Card('A', 'HEARTS', 11))
  dealer.playersHand.push(new Card('6', 'SPADES', 6))
  it('dealer wins', function () {
    expect(dealer.determineWinner()).toBe('dealer')
  })
})

describe('testDetermineWinner', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.hand = []
  dealer.hand.push(new Card('9', 'HEARTS', 9))
  dealer.hand.push(new Card('9', 'SPADES', 9))
  dealer.playersHand = []
  dealer.playersHand.push(new Card('10', 'HEARTS', 10))
  dealer.playersHand.push(new Card('10', 'SPADES', 10))
  it('dealer wins', function () {
    expect(dealer.determineWinner()).toBe('player')
  })
})

describe('testHitPlayer', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealer.dealHandToSelf()
  dealer.playersHand = []
  dealer.playersHand.push(new Card('2', 'HEARTS', 2))
  dealer.playersHand.push(new Card('10', 'HEARTS', 10))

  hitPlayer(dealer)
  it('player hit', function () {
    expect(dealer.playersHand.length).toBe(3)
  })
})

var deck = new Deck()
deck.buildDeck()
var dealer = new Dealer(deck)

function play (dealer) {
  console.log('cards in deck' + dealer.deck.cards.length)
  display.innerHTML = ''
  dealer.dealHandToSelf(dealer.deck.surrenderCard(), dealer.deck.surrenderCard())
  dealer.dealHandToPlayer(dealer.deck.surrenderCard(), dealer.deck.surrenderCard())
  display.innerHTML += 'Dealers Hand: HIDDEN of HIDDEN and ' + dealer.hand[0].name + '<br />'
  display.innerHTML += 'Your Hand: ' + dealer.playersHand[0].name + ' and ' + dealer.playersHand[1].name + ' hand value is ' + dealer.calculatePlayersHandValue() + '<br />'
}

function hitPlayer (dealer) {
  let hand = dealer.playersHand
  hand.push(dealer.deck.surrenderCard())
  display.innerHTML += hand[hand.length - 1].name + ' Recieved, Hand Value is now ' + dealer.calculatePlayersHandValue() + '<br />'
  // deal with aces
  if (dealer.playerBusted() === true) {
    display.innerHTML += 'PLAYER BUSTED'
  } else if (dealer.playerHit21() === true) {
    display.innerHTML += 'PLAYER HIT BLACKJACK!'
  } else { dealer.takeTurn() }
}

function stay (dealer) {
  // dealer hits until 17+
  dealer.takeTurn()
  display.innerHTML += 'Dealers Hand: '
  for (let x = 0; x < dealer.hand.length; x++) {
    display.innerHTML += dealer.hand[x].name + '<br />'
  }
  // check dealer's hand value
  if (dealer.dealerBusted() === true) {
    display.innerHTML += 'DEALER BUSTED'
    return
  } else if (dealer.playerHit21() === true) {
    display.innerHTML += 'DEALER HIT BLACKJACK!'
    return
  }
  let winner = dealer.determineWinner()

  if (winner === 'dealer') {
    display.innerHTML += 'DEALER WON'
  } else {
    display.innerHTML += 'PLAYER WON'
  }
}
