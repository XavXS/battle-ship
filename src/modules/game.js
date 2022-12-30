import Player from './player';

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
    player = Player();
    cpu = Player();
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

export default Game;
