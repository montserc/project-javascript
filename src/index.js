//Modelo
const suits7yM = ['Oros', 'Copas', 'Espadas', 'Bastos'];
const suits7yMColors = ['goldenrod', 'red', 'blue', 'green'];
const numbers7yM =[1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
const values7yM =[1, 2, 3, 4, 5, 6, 7, 0.5, 0.5, 0.5];

class Card {
  constructor(number, suit, color, value) {
    this.number = number;
    this.suit = suit;
    this.color = color;
    this.value = value;
  }  
  toString() {
    return `Soy la carta ${this.number} de ${this.suit}`
  }
  toImg() {
    return `/dist/img/${this.number}${this.suit}.jpg`
  }
}

class Player {
  constructor(name, score, cards) {
    this.name = name;
    this.score = score;
    this.cards = cards;
  }
  toString() {
    return `Soy el jugador ${this.name}`
  }
}

/* Aleatoriza un array según el algoritmo de Fisher-Yates */
Array.prototype.shuffle = function() {
  for (let i = this.length - 1 ; i > 0 ; i--) {
      let j = Math.floor(i * Math.random());
      let tmp = this[j];
      this[j] = this[i];
      this[i] = tmp;
  }
  return this;
}

let deck;
document.addEventListener('DOMContentLoaded',function() {
  deck = new Array(); 
  suits7yM.map((suit, suitIndex) => {
    for (let i = 0; i < numbers7yM.length; i++) {
      deck.push(new Card(numbers7yM[i], suit, suits7yMColors[suitIndex], values7yM[i]));
    }
  });
  deck.shuffle();
  renderDeck();
});

function renderDeck() {
  let divDeck = document.getElementById('deck');  
  divDeck.textContent = ''; 
  deck.forEach((card) => {
    //let divCard = document.createElement('div');
    //divCard.classList.add('card');
    //divCard.textContent = card.toString();
    //divCard.style.borderColor = card.color;
    //divDeck.append(divCard);

    let imgCard = document.createElement('img');    
    imgCard.src = card.toImg();
    imgCard.classList.add('card');        
    divDeck.append(imgCard);
  });    
}

let players;
document.getElementById('init').addEventListener('click', function (event) {
  const input = document.getElementById('num-of-players');
  const numOfPlayers = input.value;
  // comprobar si la partida ja està inciada
  if (numOfPlayers.trim()) {
    players = new Array(); 
    for (let i = 0; i < numOfPlayers; i++) {
      players.push(new Player(`${i+1}`,0,new Array()));
    }
    console.table(players);
    input.value = '';
    renderInitPlayers();
  }
});

function renderInitPlayers() {  
  let divPlayers = document.getElementById('players');  
  players.forEach((player) => {
    let divPlayer = document.createElement('div');
    divPlayer.classList.add('player');
    divPlayer.setAttribute('id', player.name);
    divPlayer.textContent = player.toString();      
    divPlayers.append(divPlayer);
    let buttonAskCard = document.createElement('button');
    buttonAskCard.innerHTML = 'Pedir Carta';
    buttonAskCard.addEventListener('click', function (event) {
        event.preventDefault;
        let card = deck.pop();
        player.cards.push(card);
        renderDeck();
        renderPlayer(player);
    });
    divPlayer.append(buttonAskCard);
    let buttonStop = document.createElement('button');
    buttonStop.innerHTML = 'Me planto';
    buttonStop.addEventListener('click', stopPlaying(player));
    divPlayer.append(buttonStop);
    divPlayer.append(document.createElement('div'));
  });   
}

function renderPlayer (player) {
  let divPlayerCards = document.getElementById(player.name).lastChild;
  divPlayerCards.textContent = ''; 
  player.cards.forEach((card) => {    
    //let divCard = document.createElement('div');
    //divCard.classList.add('card');
    //divCard.textContent = card.toString();
    //divPlayerCards.append(divCard);

    let imgCard = document.createElement('img');    
    imgCard.src = card.toImg();
    imgCard.classList.add('card');        
    divPlayerCards.append(imgCard);
  });
}

function stopPlaying (event, player) {
}
