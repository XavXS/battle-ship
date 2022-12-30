/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/modules/ship.js
function Ship(length) {
  return {
    length,
    timesHit: 0,
    isSunk() {
      return this.timesHit >= this.length;
    },
    hit() {
      this.timesHit += 1;
    },
  };
}

/* harmony default export */ const modules_ship = (Ship);

;// CONCATENATED MODULE: ./src/modules/gameBoard.js


function Gameboard() {
  const grid = [...Array(10)].map(() => Array(10));

  const attacks = [];

  const ships = [];

  const shipOrder = [2, 3, 3, 4, 5];

  function coordsValid(coords) {
    let coord;
    for (let i = 0; i < coords.length; i += 1) {
      coord = coords[i];
      if (
        coord[0] < 0 ||
        coord[0] > 9 ||
        coord[1] < 0 ||
        coord[1] > 9 ||
        grid[coord[0]][coord[1]]
      )
        return false;
    }
    return true;
  }

  function getPlaceCoords(x, y, dir) {
    const coords = [];
    const length = shipOrder[shipOrder.length - 1];
    if (dir === 'horizontal') {
      const start = x - Math.floor(length / 2);
      const end = start + length - 1;
      for (let i = start; i <= end; i += 1) coords.push([i, y]);
    } else if (dir === 'vertical') {
      const start = y - Math.floor(length / 2);
      const end = start + length - 1;
      for (let i = start; i <= end; i += 1) coords.push([x, i]);
    }
    return coords;
  }

  function placeShip(x, y, dir) {
    const ship = modules_ship(shipOrder[shipOrder.length - 1]);
    const coords = getPlaceCoords(x, y, dir);
    if (!coordsValid(coords)) throw new Error('invalid position');
    shipOrder.pop();
    coords.forEach((coord) => {
      grid[coord[0]][coord[1]] = ship;
    });
    ships.push(ship);
  }

  function receiveAttack(x, y) {
    const ship = grid[x][y];
    if (ship) ship.hit();
    attacks.push([x, y]);
  }

  function allShipsSunk() {
    let allSunk = true;
    ships.forEach((ship) => {
      if (!ship.isSunk()) allSunk = false;
    });
    return allSunk;
  }

  function allShipsPlaced() {
    return shipOrder.length === 0;
  }

  return {
    grid,
    attacks,
    placeShip,
    receiveAttack,
    allShipsSunk,
    allShipsPlaced,
    getPlaceCoords,
    coordsValid,
  };
}

/* harmony default export */ const gameBoard = (Gameboard);

;// CONCATENATED MODULE: ./src/modules/player.js


function Player() {
  const board = gameBoard();

  return {
    board,
    enemy: null,
    setEnemy(enemy) {
      this.enemy = enemy;
    },
    attack(x, y) {
      this.enemy.board.receiveAttack(x, y);
    },
  };
}

/* harmony default export */ const modules_player = (Player);

;// CONCATENATED MODULE: ./src/modules/game.js


function Game() {
  let player = null;

  let cpu = null;

  const cpuChoices = [];

  function playCpu() {
    const coordinate = cpuChoices.pop();
    cpu.attack(coordinate[0], coordinate[1]);
  }

  function generateCpu() {
    let x;
    let y;
    let dir;

    while (!cpu.board.allShipsPlaced()) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      dir =
        Math.floor(Math.random() * 2) === 0
          ? 'vertical'
          : 'horizontal';
      try {
        cpu.board.placeShip(x, y, dir);
      } catch (err) {
        // do nothing
      }
    }
  }

  function playTurns(x, y) {
    player.attack(x, y);
    playCpu();
  }

  function fillCpu() {
    for (let i = 0; i < 10; i += 1)
      for (let j = 0; j < 10; j += 1) cpuChoices.push([i, j]);
  }

  function shuffleCpu() {
    let currentIndex = cpuChoices.length;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      [cpuChoices[currentIndex], cpuChoices[randomIndex]] = [
        cpuChoices[randomIndex],
        cpuChoices[currentIndex],
      ];
    }
  }

  function initCpu() {
    fillCpu();
    shuffleCpu();
  }

  function initPlayers() {
    player = modules_player();
    cpu = modules_player();
    cpu.setEnemy(player);
    player.setEnemy(cpu);
  }

  function init() {
    initCpu();
    initPlayers();
    generateCpu();
  }

  init();

  return {
    player,
    cpu,
    playTurns,
  };
}

/* harmony default export */ const game = (Game);

;// CONCATENATED MODULE: ./src/modules/ui.js
let playerUI = document.querySelector('.player');
let cpuUI = document.querySelector('.cpu');
let setupUI = document.querySelector('.setup');
let placeDirection = 'horizontal';

function switchDirection() {
  if (placeDirection === 'horizontal') placeDirection = 'vertical';
  else placeDirection = 'horizontal';
}

function coordToIndex(x, y) {
  if (x < 0 || x > 9 || y < 0 || y > 9) return -1;
  return 10 * y + x;
}

function updateAttacks(player, ui) {
  let index;
  player.board.attacks.forEach((attack) => {
    index = coordToIndex(attack[0], attack[1]);
    if (!player.board.grid[attack[0]][attack[1]])
      ui.children[index].classList.add('miss');
    else ui.children[index].classList.add('hit');
  });
}

function updateBoards(game) {
  updateAttacks(game.cpu, playerUI);
  updateAttacks(game.player, cpuUI);
}

function fillBoards() {
  const boards = document.querySelectorAll('.board');
  boards.textContent = '';
  boards.forEach((board) => {
    let square;
    for (let i = 0; i < 100; i += 1) {
      square = document.createElement('div');
      square.classList.add('square');
      board.appendChild(square);
    }
  });
}

function tryEndGame(game) {
  const status = document.querySelector('.status');
  if (game.player.board.allShipsSunk())
    status.textContent = 'CPU wins';
  else if (game.cpu.board.allShipsSunk())
    status.textContent = 'You win';
  else return;
  for (let i = 0; i < playerUI.children.length; i += 1) {
    const oldElement = playerUI.children[i];
    oldElement.classList.add('disabled');
    const newElement = oldElement.cloneNode(true);
    playerUI.replaceChild(newElement, oldElement);
  }
}

function initPlayer(game) {
  let index;
  let square;
  for (let x = 0; x < 10; x += 1)
    for (let y = 0; y < 10; y += 1) {
      index = coordToIndex(x, y);
      square = playerUI.children[index];
      square.addEventListener(
        'click',
        function play() {
          if (
            this.classList.contains('hit') ||
            this.classList.contains('miss')
          )
            return;
          game.playTurns(x, y);
          updateBoards(game);
          tryEndGame(game);
        }.bind(square)
      );
    }
}

function clearSetupHover() {
  const squares = document.querySelectorAll('.setup .square');
  squares.forEach((square) => {
    square.classList.remove('valid');
    square.classList.remove('invalid');
  });
}

function getDirection() {
  return placeDirection;
}

function initSetup(game) {
  const ui = setupUI;
  let index;
  for (let x = 0; x < 10; x += 1)
    for (let y = 0; y < 10; y += 1) {
      index = coordToIndex(x, y);

      ui.children[index].addEventListener('click', () => {
        const dir = getDirection();
        const coords = game.player.board.getPlaceCoords(x, y, dir);
        if (game.player.board.coordsValid(coords))
          coords.forEach((coord) => {
            const i = coordToIndex(coord[0], coord[1]);
            if (i !== -1) ui.children[i].classList.add('ship');
          });
        game.player.board.placeShip(x, y, dir);
      });

      ui.children[index].addEventListener('mouseenter', () => {
        const dir = getDirection();
        const coords = game.player.board.getPlaceCoords(x, y, dir);
        if (game.player.board.coordsValid(coords))
          coords.forEach((coord) => {
            const i = coordToIndex(coord[0], coord[1]);
            if (i !== -1) ui.children[i].classList.add('valid');
          });
        else
          coords.forEach((coord) => {
            const i = coordToIndex(coord[0], coord[1]);
            if (i !== -1) ui.children[i].classList.add('invalid');
          });
      });

      ui.children[index].addEventListener('mouseleave', () => {
        clearSetupHover();
      });
    }
}

function initBoards(game) {
  fillBoards();
  initSetup(game);
  initPlayer(game);
}

function initValues() {
  playerUI = document.querySelector('.player');
  cpuUI = document.querySelector('.cpu');
  setupUI = document.querySelector('.setup');
}

function initButtons(game) {
  const rotateBtn = document.querySelector('.rotate');
  rotateBtn.addEventListener('click', switchDirection);

  const startBtn = document.querySelector('.start');
  const overlay = document.querySelector('.overlay');
  startBtn.addEventListener('click', () => {
    if (game.player.board.allShipsPlaced())
      overlay.classList.add('hidden');
    else startBtn.classList.add('invalid');
  });

  const menuBtn = document.querySelector('.menu');
  menuBtn.addEventListener('click', () => {
    window.location.reload();
  });
}

function initUI(game) {
  initValues();
  initButtons(game);
  initBoards(game);
}

/* harmony default export */ const ui = (initUI);

;// CONCATENATED MODULE: ./src/index.js




ui(game());

/******/ })()
;