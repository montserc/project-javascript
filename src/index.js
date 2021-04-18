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
  const input = document.getElementById('num-of-players');
  const numOfPlayers = input.value;
  let card;
  if (numOfPlayers.trim()) {
    initDeck();  
    players.length = 0;
    for (let i = 0; i < numOfPlayers; i++) {
      players.push(new Player(i+1, (i == 0 ? true : false)));
      card = deck.pop();
      card.faceDown = !players[i].cards.some(playerCard => playerCard.faceDown == true);
      players[i].cards.push(card);
    }
    input.value = '';
    renderDeck();    
    renderPlayers();    
  }
});

document.getElementById('new-hand').addEventListener('click', function (event) {
  if (players.length > 0) {
    initDeck();    
    let card;
    for (let i = 0; i < players.length; i++) {
      players[i].playing = (i == 0 ? true : false);
      players[i].cards.length = 0;
      card = deck.pop();
      card.faceDown = !players[i].cards.some(playerCard => playerCard.faceDown == true);
      players[i].cards.push(card);
      renderPlayer(players[i]);
    }
    renderDeck(); 
  }
});

function renderDeck() {
  const boxDeck = document.getElementById('deck');  
  boxDeck.textContent = ''; 
  deck.forEach((card, index) => {
    let imgCard = document.createElement('img');    
    imgCard.src = card.toImg();
    imgCard.classList.add('card'); 
    imgCard.style.transform = `translateX(${index*1.2}rem)`;
    boxDeck.append(imgCard);
  });    
}

function renderPlayers() {  
  document.getElementById('rules').style.display = 'none';
  const boxPlayers = document.getElementById('players');  
  boxPlayers.textContent = '';
  players.forEach((player, index) => {
    const boxPlayer = document.createElement('div');
    boxPlayer.classList.add('player');
    boxPlayer.setAttribute('id', player.identifier);
    boxPlayer.textContent = player.toString();          
    boxPlayers.append(boxPlayer);
    const buttonDrawCard = document.createElement('button');
    buttonDrawCard.innerHTML = 'Pedir Carta';
    buttonDrawCard.addEventListener('click', drawCard(player, index));    
    buttonDrawCard.disabled = !player.playing;
    boxPlayer.append(buttonDrawCard);
    const buttonStopDrawCard = document.createElement('button');
    buttonStopDrawCard.innerHTML = 'Me planto';
    buttonStopDrawCard.addEventListener('click', function (event) {
      stopDrawCard(player, index);
    });
    buttonStopDrawCard.disabled = !player.playing;
    boxPlayer.append(buttonStopDrawCard);
    const spanResult = document.createElement('span'); 
    spanResult.setAttribute('id', `result${player.identifier}`);
    boxPlayer.append(spanResult);
    const inputScoreboard = document.createElement('input'); 
    inputScoreboard.setAttribute('id', `score${player.identifier}`);
    inputScoreboard.setAttribute('type', 'text');
    inputScoreboard.setAttribute('size', '2');
    const labelScoreboard = document.createElement('label');
    labelScoreboard.textContent = 'Marcador: ';
    labelScoreboard.append(inputScoreboard);    
    boxPlayer.append(labelScoreboard);
    boxPlayer.append(document.createElement('div'));  //boxCards  
    renderPlayerCards(player);
  });       
}

const drawCard = (player, index) => () => {
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
};

function stopDrawCard (currentPlayer, iCurrentPlayer) { 
  let iNextPlayer = iCurrentPlayer + 1;
  currentPlayer.playing = false;
  renderPlayer(currentPlayer);
  if (iNextPlayer < players.length) {
    players[iNextPlayer].playing = true;  
    renderPlayer(players[iNextPlayer]);
  } else { 
    let kingScore = winningScore();
    players.filter((player) => player.score() == kingScore).forEach((player) => player.winningHands += 1); 
    renderScoreBoards(kingScore);
  }
}

const winningScore = () => {
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

function renderPlayer(player){
  const boxPlayer = document.getElementById(player.identifier);
  const boxResult = document.getElementById(`result${player.identifier}`)
  boxPlayer.querySelectorAll('button').forEach((button) =>
    button.disabled = !player.playing
  );
  boxResult.innerHTML = '';
  boxResult.className = '';
  let score = player.score();
  if (score > maxScore) {      
    boxResult.innerHTML = `&#9760; Estás fuera con una puntuación de ${score}`;
    boxResult.classList.add('out');
  }
  renderPlayerCards(player);  
}

function renderPlayerCards (player) {  
  const boxPlayerCards = document.getElementById(player.identifier).lastChild;
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

function renderScoreBoards(kingScore) { 
  let boxResult;   
  players.filter((player) => player.score() < kingScore).forEach((player) => { 
    boxResult = document.getElementById(`result${player.identifier}`);
    boxResult.innerHTML = `Tu puntuación es de ${player.score()}`
    boxResult.classList.add('loser');
  });    
  players.filter((player) => player.score() == kingScore).forEach((player) => { 
    boxResult = document.getElementById(`result${player.identifier}`);
    boxResult.innerHTML = `&#9819; Has ganado con una puntuación de ${player.score()}`
    boxResult.classList.add('winner');
  });
  players.forEach((player) => document.getElementById(`score${player.identifier}`).setAttribute('value',player.winningHands));  
}