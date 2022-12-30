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

export default initUI;
