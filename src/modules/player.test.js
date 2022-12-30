import Player from './player';

test('player attacks grid', () => {
  const enemy = Player();
  enemy.board.placeShip(4, 4, 'vertical');
  const player = Player();
  player.setEnemy(enemy);
  player.attack(4, 4);
  expect(enemy.board.grid[4][4].timesHit).toBe(1);
});
