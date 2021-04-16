//Modelo
const suits7yM = ['Oros', 'Copas', 'Espadas', 'Bastos'];
const numbers7yM =[1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
const values7yM =[1, 2, 3, 4, 5, 6, 7, 0.5, 0.5, 0.5];
const maxScore = 7.5;

import { 
  Card,
  Player 
} from './classes';

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
  const input = document.getElementById('num-of-players');
  const numOfPlayers = input.value;
  let card;
  // comprobar si la partida ja està inciada
  if (numOfPlayers.trim()) {
    players.length = 0;
    for (let i = 0; i < numOfPlayers; i++) {
      players.push(new Player((i == numOfPlayers-1 ? 'La Banca' : `Jugador ${i+1}`), (i == 0 ? true : false)));
      card = deck.pop();
      card.faceDown = !players[i].cards.some(playerCard => playerCard.faceDown == true);
      players[i].cards.push(card);
    }
    //console.table(players);
    input.value = '';
    renderPlayers();    
  }
  renderDeck();
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
  const boxPlayers = document.getElementById('players');  
  boxPlayers.textContent = '';
  players.forEach((player, index) => {
    const boxPlayer = document.createElement('div');
    boxPlayer.classList.add('player');
    boxPlayer.setAttribute('id', player.name);
    //boxPlayer.textContent = player.toString();      
    boxPlayer.textContent = player.name;      
    boxPlayers.append(boxPlayer);
    const buttonDrawCard = document.createElement('button');
    buttonDrawCard.innerHTML = 'Pedir Carta';
    buttonDrawCard.addEventListener('click', function (event) {
        event.preventDefault;
        drawCard(player, index);
    });
    buttonDrawCard.disabled = !player.playing;
    boxPlayer.append(buttonDrawCard);
    const buttonStopDrawCard = document.createElement('button');
    buttonStopDrawCard.innerHTML = 'Me planto';
    buttonStopDrawCard.addEventListener('click', function (event) {
      event.preventDefault;
      stopDrawCard(player, index);
    });
    buttonStopDrawCard.disabled = !player.playing;
    boxPlayer.append(buttonStopDrawCard);
    boxPlayer.append(document.createElement('span')); //boxMsgOut
    const inputScoreboard = document.createElement('input'); //boxScore
    inputScoreboard.setAttribute('id', `score${player.name}`);
    inputScoreboard.setAttribute('type', 'text');
    const labelScoreboard = document.createElement('label');
    labelScoreboard.textContent = 'Marcador: ';
    labelScoreboard.append(inputScoreboard);    
    boxPlayer.append(labelScoreboard);
    boxPlayer.append(document.createElement('div'));  //boxCards  
    renderPlayerCards(player);
  });       
}

function drawCard(player, index) {
  let card = deck.pop();
  card.faceDown = !player.cards.some(playerCard => playerCard.faceDown == true);
  player.cards.push(card);
  if (player.score() > maxScore) {
    player.cards.forEach(card => card.faceDown=false);
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
    players.filter((player) => player.score() == winningScore()).forEach((player) => player.winningHands += 1); 
    console.table(players);
    renderScoreBoards();
  }
  players[iCurrentPlayer].playing = false;
  renderPlayer(players[iCurrentPlayer],iCurrentPlayer);
}

const winningScore = function () {
  let score = 0;  
  let playerScore;
  players.forEach((player, index) => {
    playerScore = player.score();
    if(playerScore <= maxScore && playerScore > score) {
      score = playerScore;
    }
  });
  return score;
};

function renderPlayer(player, index){
  let boxPlayer = document.getElementById(player.name);
  Object.values(boxPlayer.getElementsByTagName('button')).forEach((button) =>
    button.disabled = !player.playing
  );
  let score = player.score();
  if (score > maxScore) {      
    boxPlayer.getElementsByTagName('span')[0].innerHTML = `&#9760; Quedas fuera en esta mano ${score}`;
  }
  renderPlayerCards(player);  
}

function renderPlayerCards (player) {  
  const boxPlayerCards = document.getElementById(player.name).lastChild;
  boxPlayerCards.textContent = ''; 
  player.cards.forEach((card, iCard) => {    
    const imgCard = document.createElement('img');
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

function renderScoreBoards() { 
  players.forEach((player) => document.getElementById(`score${player.name}`).setAttribute('value',player.winningHands));
}