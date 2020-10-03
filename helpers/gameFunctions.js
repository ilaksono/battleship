board.onclick = (evt, gameBoard) => {
  let cellID = evt.target.id;
  let coord = convertToCoord(cellID); // converts e.g.'A1' to [0, 0]
  if (gameState.phase === 'set') {
    if (shipsAvailable && gameState.setDone) {
      placeShipsHorizontal(gameBoard, shipsAvailable[0].size, coord);
      gameState.activeShipCell = cellID;
      gameState.currentShipOrient = 'H';
      return gameBoard;
    }
    else if (shipsAvailable && !gameState.setDone) { // 
      if (cellID === gameState.activeShipCell)
        toggleShipBoard();
    }
    // if (boardIsEmpty(board))

    if (allShipsSet(shipsAvailable))
      gameState.phase = 'battle';
    completeSet = true;

    return;
  }
  return cellID;
};

btnConfirm.onclick = (evt) => {
  if(allShipsSet(shipsAvailable) && gameState.phase === 'set')
    gameState.phase = 'battle';

   
};

const toggleShipBoard = (ship) => {
  if (ship.orientation === 'H') {
    for (let i = 1; i < ship.size; i++) {
      const delta = ship.coordinates[i][1] - ship.coordinates[0][1];
      ship.coordinates[i][1] = ship.coordinates[0][1];
      ship.coordinates[i][0] += delta; 
    }
    ship.orientation = 'V';
    return;
  }
  else if(ship.orientation === 'V') {
    for (let i = 1; i < ship.size; i++) {
      const delta = ship.coordinates[i][0] - ship.coordinates[0][0];
      ship.coordinates[i][0] = ship.coordinates[0][0];
      ship.coordinates[i][1] += delta; 
    }
    ship.orientation = 'H';
    return;
  }
};

const gameState = { // possible game states = register, set ,battle, end
  phase: 'set',
  setDone: false,
  completeSet: false,
  activeShipCell: null,
  currentShipOrient: null,
  toggleShipOrient: function () {
    if (this.currentShipOrient === 'H')
      this.currentShipOrient = 'V';
    else
      this.currentShipOrient = 'H';
  }
};

const allShipsSet = (shipArr) => {
  for (let ship of shipArr) {
    if (ship.available) return false;
  }
  return true;
};

const shipsAvailable = [
  {
    available: true,
    size: 2,
    code: 'A',
    coordinates: [],
    orientation: null
  },
  {
    available: true,
    size: 3,
    code: 'B',
    coordinates: [],
    orientation: null
  },
  {
    available: true,
    size: 3,
    code: 'C',
    coordinates: [],
    orientation: null
  },
  {
    available: true,
    size: 4,
    code: 'D',
    coordinates: [],
    orientation: null
  },
  {
    available: true,
    size: 5,
    code: 'E',
    coordinates: [],
    orientation: null
  }
];

const recordMove = (id, player) => `${player} shoots at ${id}: ${takeShot(convertToCoord(board, id)) ? 'HIT' : 'MISS'}`;

const convertToCoord = str => {
  let col = String.charCodeAt(str[0]) - 65;
  let row = Number([...id].slice(1)) - 1;
  return [row, col];
};

const takeShot = (board, coord) => board[coord[0]][coord[1]] === '1';

const hitShip = (coord, board) => {
  board[coord[0]][coord[1]] = 'X';
  console.log('HIT');
};

const placeShipsHorizontal = (board, ship, coord) => {
  let tmp = Array(ship.size).fill(ship.code);
  board[coord[0]].splice(coord[1], ship.size, ...tmp);
  for (let i = 0; i < ship.size; i++)
    ship.coordinates.push([coord[0], coord[1] + i]);
  ship.orientation = 'H';

  return board;

};

const placeShipsVertical = (board, ship, coord) => {
  for (let row = coord[0]; row < coord[0] + ship.size; row++)
    board[row][coord[1]] = ship.code;
  return board;
};
const placeShip = (board, size, coord, orient) => {
  if (orient) return placeShipsHorizontal(board, size, coord);
  else return placeShipsVertical(board, size, corod);

};

verify.onclick = (evt) => {

};;


//trying promises
// const setBoard = (board, size, player) => {
//   return new Promise((res, rej) => {
//     let cellID = board.onclick
//     let coord = convertToCoord(cellID);
//     users[player].board = board;
//     placeShip(board, 5, coord, orient);
//     res(board);
//     rej('Error: cannot set ship');
//   });
// };

// setBoard(board, 5, player).then((board) => {
//   return setBoard(board, 4,)
// }).then((board) => {
//   return setBoard(board, 3, player)
// }).then((board) => {
//   return setBoard(board, 3)
// }).then((board) => {
//   return setBoard(board, 2)
// }).then((board) => {
//   users[player].board = board;
// }).catch(err => {
//   console.log(err);
// });