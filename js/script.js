' use strict '

var display = document.getElementById('display')
var playerCardImageOne = document.getElementById('playerCardImageOne')
var playerCardImageTwo = document.getElementById('playerCardImageTwo')
var playerCardImageThree = document.getElementById('playerCardImageThree')
var playerCardImageFour = document.getElementById('playerCardImageFour')
var playerCardImageFive = document.getElementById('playerCardImageFive')

var dealerCardImageOne = document.getElementById('dealerCardImageOne')
var dealerCardImageTwo = document.getElementById('dealerCardImageTwo')
var dealerCardImageThree = document.getElementById('dealerCardImageThree')
var dealerCardImageFour = document.getElementById('dealerCardImageFour')
var dealerCardImageFive = document.getElementById('dealerCardImageFive')

var hitButton = document.getElementById('hit')
var stayButton = document.getElementById('stay')

function clearCards () {
  let allImages = document.getElementsByTagName('img')
  for (let i = 2; i < allImages.length; i++) {
    allImages[i].src = './images/blank.png'
  }
}

function clearDisplay () {
  display.innerHTML = ''
}

class Card {
  constructor (rank, suit, value) {
    this.rank = rank
    this.suit = suit
    this.value = value
    this.image = './images/cards/' + this.suit + '-' + value + '.png'
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
    this.suits = ['1', '2', '3', '4']
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
  isLowOnCards () {
    if (this.cards.length < 26) {
      return true
    } else { return false }
  }
}

class Dealer {
  constructor (deck) {
    this.deck = deck
  }
  dealHandToPlayer (cardOne, cardTwo) {
    this.playersHand = []
    this.playersHand.push(cardOne)
    this.playersHand.push(cardTwo)
  }
  dealHandToSelf (cardOne, cardTwo) {
    this.hand = []
    this.hand.push(cardOne)
    this.hand.push(cardTwo)
  }
  calculatePlayersHandValue () {
    let value = 0
    let aces = 0
    for (let i = 0; i < this.playersHand.length; i++) {
      if (this.playersHand[i].isAce === true) {
        aces++
      }
      value += this.playersHand[i].value
    }
    if (value > 21 && aces > 0) {
      value -= 10
      aces--
    }
    return value
  }
  calculateDealersHandValue () {
    let value = 0
    let aces = 0
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].isAce === true) {
        aces++
      }
      value += this.hand[i].value
    }
    if (value > 21 && aces > 0) {
      value -= 10
      aces--
    }
    return value
  }
  playerBusted () {
    if (this.calculatePlayersHandValue() > 21) {
      hitButton.disabled = true
      stayButton.disabled = true
      return true
    } else return false
  }
  playerHit21 () {
    if (this.calculatePlayersHandValue() === 21) {
      hitButton.disabled = true
      stayButton.disabled = true
      return true
    } else return false
  }
  takeTurn () {
    while (this.calculateDealersHandValue() < 17) {
      let card = this.deck.surrenderCard()
      let src = card.image
      this.hand.push(card)
      switch (this.hand.length) {
        case 3:
          dealerCardImageThree.src = src
          break
        case 4:
          dealerCardImageFour.src = src
          break
        case 5:
          dealerCardImageFive.src = src
          break
      }
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

var deck = new Deck()
deck.buildDeck()
var dealer = new Dealer(deck)

function play (dealer) {
  hitButton.disabled = false
  stayButton.disabled = false
  clearCards()
  clearDisplay()
  if (deck.isLowOnCards()) {
    deck.buildDeck()
  }
  dealInitialHands(dealer)
}

function dealInitialHands (dealer) {
  let dealerCardOne = dealer.deck.surrenderCard()
  let dealerCardTwo = dealer.deck.surrenderCard()
  dealer.dealHandToSelf(dealerCardOne, dealerCardTwo)
  dealerCardImageOne.src = dealerCardOne.image
  dealerCardImageTwo.src = dealerCardTwo.image
  console.log('d' + dealerCardOne.image)
  console.log('d' + dealerCardTwo.image)

  let playerCardOne = dealer.deck.surrenderCard()
  let playerCardTwo = dealer.deck.surrenderCard()
  dealer.dealHandToPlayer(playerCardOne, playerCardTwo)
  playerCardImageOne.src = playerCardOne.image
  playerCardImageTwo.src = playerCardTwo.image
  console.log('p' + playerCardOne.image)
  console.log('p' + playerCardTwo.image)
}

function hitPlayer (dealer) {
  let hand = dealer.playersHand
  let card = dealer.deck.surrenderCard()
  let src = card.image
  hand.push(card)
  addCardImage(hand, src)
  displayHitAlert(card, dealer)
}

function displayHitAlert (card, dealer) {
  display.innerHTML += card.name + ' Recieved, new hand value: ' + dealer.calculatePlayersHandValue() + '<br />'
  if (dealer.playerBusted() === true) {
    display.innerHTML += 'PLAYER BUSTED'
  } else if (dealer.playerHit21() === true) {
    display.innerHTML += 'PLAYER HIT BLACKJACK!'
  }
}

function addCardImage (hand, src) {
  switch (hand.length) {
    case 3:
      playerCardImageThree.src = src
      break
    case 4:
      playerCardImageFour.src = src
      break
    case 5:
      playerCardImageFive.src = src
      break
  }
}

function stay (dealer) {
  hitButton.disabled = true
  stayButton.disabled = true
  dealer.takeTurn()
  displayStayAlert(dealer)
}

function displayStayAlert (dealer) {
  display.innerHTML += 'Dealer final hand value: ' + dealer.calculateDealersHandValue() + '<br/>'
  if (dealer.dealerBusted() === true) {
    display.innerHTML += 'DEALER BUSTED'
  } else if (dealer.playerHit21() === true) {
    display.innerHTML += 'DEALER HIT BLACKJACK!'
  }
  let winner = dealer.determineWinner()
  display.innerHTML += winner.toUpperCase() + ' WON'
}

// TESTS ******************************* TESTS ************************

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

xdescribe('testTakeTurn', function () {
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
  dealer.playersHand = []
  dealer.playersHand.push(new Card('2', 'HEARTS', 2))
  dealer.playersHand.push(new Card('10', 'HEARTS', 10))
  hitPlayer(dealer)
  display.innerHTML = ''
  it('player hit', function () {
    expect(dealer.playersHand.length).toBe(3)
    clearDisplay()
    clearCards()
  })
})

describe('testDealInitialHands', function () {
  let deck = new Deck()
  deck.buildDeck()
  let dealer = new Dealer(deck)
  dealInitialHands(dealer)
  it('Hands dealt', function () {
    expect(dealer.hand.length).toBe(2)
    expect(dealer.playersHand.length).toBe(2)
  })
})
