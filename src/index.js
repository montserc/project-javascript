//Modelo
const suits7yM = ['Oros', 'Copas', 'Espadas', 'Bastos'];
const numbers7yM =[1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
const values7yM =[1, 2, 3, 4, 5, 6, 7, 0.5, 0.5, 0.5];

class Card {
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

class Player {
  constructor(name, playing) {
    this.name = name;
    this.playing = playing;   
    this.cards = new Array();
  }
  toString() {
    return `Jugador ${this.name}`;
  }
  score() {
    return this.cards.reduce((sum, card) => sum + card.value, 0);
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
let players;
document.addEventListener('DOMContentLoaded',function() {  
  deck = new Array();
  players = new Array();
});

function initDeck() {     
  deck.length = 0;
  suits7yM.map((suit, suitIndex) => {
    for (let i = 0; i < numbers7yM.length; i++) {
      deck.push(new Card(numbers7yM[i], suit, values7yM[i]));
    }
  });
  deck.shuffle();
}

document.getElementById('init').addEventListener('click', function (event) {
  initDeck();  
  renderDeck();
  const input = document.getElementById('num-of-players');
  const numOfPlayers = input.value;
  // comprobar si la partida ja està inciada
  if (numOfPlayers.trim()) {
    players.length = 0;
    for (let i = 0; i < numOfPlayers; i++) {
      players.push(new Player(`${i+1}`,(i == 0 ? true : false)));
    }
    console.table(players);
    input.value = '';
    renderPlayers();
  }
});

function renderDeck() {
  let boxDeck = document.getElementById('deck');  
  boxDeck.textContent = ''; 
  deck.forEach((card, index) => {
    let imgCard = document.createElement('img');    
    imgCard.src = card.toImg();
    imgCard.classList.add('card'); 
    imgCard.style.transform = `translateX(${index*20}px)`;
    boxDeck.append(imgCard);
  });    
}

function renderPlayers() {  
  let boxPlayers = document.getElementById('players');  
  boxPlayers.textContent = '';
  players.forEach((player, index) => {
    let boxPlayer = document.createElement('div');
    boxPlayer.classList.add('player');
    boxPlayer.setAttribute('id', player.name);
    boxPlayer.textContent = player.toString();      
    boxPlayers.append(boxPlayer);
    let buttonDrawCard = document.createElement('button');
    buttonDrawCard.innerHTML = 'Pedir Carta';
    buttonDrawCard.addEventListener('click', function (event) {
        event.preventDefault;
        drawCard(player, index);
    });
    buttonDrawCard.disabled = !player.playing;
    boxPlayer.append(buttonDrawCard);
    let buttonStopDrawCard = document.createElement('button');
    buttonStopDrawCard.innerHTML = 'Me planto';
    buttonStopDrawCard.addEventListener('click', function (event) {
      event.preventDefault;
      stopDrawCard(player, index);
    });
    buttonStopDrawCard.disabled = !player.playing;
    boxPlayer.append(buttonStopDrawCard);
    boxPlayer.append(document.createElement('span')); //boxScore
    boxPlayer.append(document.createElement('div'));  //boxCards  
    });   
}

function drawCard(player, index) {
  let card = deck.pop();
  card.faceDown = !player.cards.some(playerCard => playerCard.faceDown == true);
  player.cards.push(card);
  if (player.score() > 7.5) {
    stopDrawCard(player, index);
  } else {
    renderDeck();    
    renderPlayer(player);  
  }
}

function stopDrawCard(CurrentPlayer, iCurrentPlayer) { 
  let iNextPlayer = iCurrentPlayer + 1;
  if (iNextPlayer < players.length) {
    players[iNextPlayer].playing = true;  
    renderPlayer(players[iNextPlayer],iNextPlayer);
  } else {
    //ultim en jugar. Comprovar resultat.
  }
  players[iCurrentPlayer].playing = false;
  renderPlayer(players[iCurrentPlayer],iCurrentPlayer);
}

function renderPlayer(player, index){
  let boxPlayer = document.getElementById(player.name);
  Object.values(boxPlayer.getElementsByTagName('button')).forEach((button) =>
    button.disabled = !player.playing
  );
  let score = player.score();
  if (score > 7.5) {      
    boxPlayer.getElementsByTagName('span')[0].innerHTML = `&#9760; Estás fuera del juego ${score}`;
  }
  renderPlayerCards(player);  
}

function renderPlayerCards (player) {  
  let boxPlayerCards = document.getElementById(player.name).lastChild;
  boxPlayerCards.textContent = ''; 
  player.cards.forEach((card, iCard) => {    
    let imgCard = document.createElement('img');
    imgCard.addEventListener('click', function(event) {
      if (iCard == (player.cards.length-1)) {
        card.faceDown = !player.cards.some(playerCard => playerCard.faceDown == true);
      } else {
        card.faceDown = false;
      }
      imgCard.src = card.toImg();
    });
    imgCard.src = card.toImg();
    imgCard.classList.add('card');        
    boxPlayerCards.append(imgCard);
  });
}