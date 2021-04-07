//Modelo
const suits7yM = ['Oros', 'Copas', 'Espadas', 'Bastos'];
const numbers7yM =[1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
const values7yM =[1, 2, 3, 4, 5, 6, 7, 0.5, 0.5, 0.5];

class Card {
  constructor(number, suit, value) {
      this.number = number;
      this.suit = suit;
      this.value = value;
  }
  toString() {
    return `Soy la carta ${this.number} de ${this.suit}`
  }
}

class Player {
  constructor(name) {
      this.name = name;
      this.score = 0;
      this.cards = [];
  }
  toString() {
    return `Soy el jugador ${this.name}`
  }
}

let deck;
document.addEventListener('DOMContentLoaded',function() {
  deck = new Array(); 
  suits7yM.map((suit) => {
    for (let i = 0; i < numbers7yM.length; i++) {
      deck.push(new Card(numbers7yM[i], suit, values7yM[i]));
    }
  });
  renderInit();
});

let players;
function renderInit() {
  let divDeck = document.getElementById('deck');  
  deck.forEach((card) => {
    let divCard = document.createElement('div');
    divCard.classList.add('card');
    divCard.textContent = card.toString();
    divDeck.append(divCard);
  });    
  document.forms[0].addEventListener('submit', function (event) {
    event.preventDefault();
    const numOfPlayers = this.querySelector('input').value;
    players = new Array(); 
    for (let i = 0; i < numOfPlayers; i++ ) {
      players.push(new Player(`${i+1}`));
    }
    let divPlayers = document.getElementById('players');  
    players.forEach((player) => {
      let buttonAskCard = document.createElement('button');
      buttonAskCard.innerHTML = 'Pedir Carta';
      buttonAskCard.addEventListener('click',askCard);
      let divPlayer = document.createElement('div');
      divPlayer.classList.add('player');
      divPlayer.textContent = player.toString();
      divPlayer.append(buttonAskCard);
      divPlayers.append(divPlayer);
    });   
  });
}

function askCard (event) {
  //Math.random() * deck.length();
}
