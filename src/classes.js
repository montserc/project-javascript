export class Card {
  constructor(number, suit, value) {
    this.number = number;
    this.suit = suit;
    this.value = value;
    this.faceDown = true;
  }  
  toString() {
    return `Carta ${this.number} de ${this.suit}`;
  }
  toImgFront() {
    return `/dist/img/${this.number}${this.suit}.jpg`;
  }
  toImgBack() {
    return `/dist/img/back.jpg`;
  }
  toImg() {
    return (this.faceDown == true ? `/dist/img/back.jpg` : `/dist/img/${this.number}${this.suit}.jpg`);
  }
}

export class Player {
  constructor(name, playing) {
    this.name = name;
    this.playing = playing;       
    this.cards = new Array();
    this.winningHands = 0;   
  }
  /*
  toString() {
    return (`${this.name}`);
  }
  */
  score() {
    return this.cards.reduce((sum, card) => sum + card.value, 0);
  }
}