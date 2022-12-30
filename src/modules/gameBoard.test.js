import Gameboard from './gameBoard';

test('gameboard initializes correctly', () => {
  const gb = Gameboard();
  expect(gb.grid.length).toBe(10);
  expect(gb.grid[0].length).toBe(10);
});

test('gameboard places ship at given coordinate', () => {
  const gb = Gameboard();
  gb.placeShip(4, 4, 'vertical');
  expect(gb.grid[4][4].length).toBe(5);
  expect(gb.grid[4][5].length).toBe(5);
  expect(gb.grid[4][3].length).toBe(5);
  expect(gb.grid[4][9]).toBe(undefined);
});

test('ships do not overlap', () => {
  const gb = Gameboard();
  gb.placeShip(4, 4, 'vertical');
  expect(() => gb.placeShip(4, 4, 'horizontal')).toThrow();
});

test('gameboard places all ships', () => {
  const gb = Gameboard();
  gb.placeShip(4, 0, 'horizontal');
  expect(gb.allShipsPlaced()).toBe(false);
  gb.placeShip(4, 1, 'horizontal');
  expect(gb.allShipsPlaced()).toBe(false);
  gb.placeShip(4, 2, 'horizontal');
  expect(gb.allShipsPlaced()).toBe(false);
  gb.placeShip(4, 3, 'horizontal');
  expect(gb.allShipsPlaced()).toBe(false);
  gb.placeShip(4, 4, 'horizontal');
  expect(gb.allShipsPlaced()).toBe(true);
});

test('ships do not go out of bounds', () => {
  const gb = Gameboard();
  expect(() => gb.placeShip(0, 0, 'vertical')).toThrow();
});

test('ships get hit by coordinates', () => {
  const gb = Gameboard();
  gb.placeShip(4, 4, 'vertical');
  gb.receiveAttack(4, 4);
  expect(gb.grid[4][4].timesHit).toBe(1);
  gb.receiveAttack(4, 5);
  expect(gb.grid[4][5].timesHit).toBe(2);
  gb.receiveAttack(4, 3);
  expect(gb.grid[4][3].timesHit).toBe(3);
  expect(gb.attacks).toEqual([
    [4, 4],
    [4, 5],
    [4, 3],
  ]);
});

test('gameboard reports if all ships sunk', () => {
  const gb = Gameboard();
  gb.placeShip(4, 4, 'vertical');
  gb.receiveAttack(4, 6);
  expect(gb.allShipsSunk()).toBe(false);
  gb.receiveAttack(4, 5);
  expect(gb.allShipsSunk()).toBe(false);
  gb.receiveAttack(4, 4);
  expect(gb.allShipsSunk()).toBe(false);
  gb.receiveAttack(4, 3);
  expect(gb.allShipsSunk()).toBe(false);
  gb.receiveAttack(4, 2);
  expect(gb.allShipsSunk()).toBe(true);
});
