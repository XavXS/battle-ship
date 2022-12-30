import Ship from './ship';

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
    const ship = Ship(shipOrder[shipOrder.length - 1]);
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

export default Gameboard;
