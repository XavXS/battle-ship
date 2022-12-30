import GameBoard from './gameBoard';

function Player() {
  const board = GameBoard();

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

export default Player;
