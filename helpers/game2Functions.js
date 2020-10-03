board2.onclick = (evt) => {
  const player = 'Player 2'
  const cellID = evt.target.id;
  const coord = convertToCoord(cellID); // converts e.g.'A1' to [0, 0]
  if (gameState.phase === 'set') {
    if (shipsAvailable && gameState.setDone) {
      gameState.setDone = false;
      placeShipsHorizontal(gameBoard, shipsAvailable[gameState.currentShipIn], coord);
      gameState.activeShipCell = cellID;
      gameState.currentShipOrient = 'H';
      return gameBoard;
    } else if (shipsAvailable[4].available === true && !gameState.setDone) { // 
      if (cellID === gameState.activeShipCell)
        return toggleShipBoard(shipsAvailable[currentShipIn]);
      else if (cellID !== gameState.activeShipCell)
        return confirmShipPlacement(shipsAvailable[currentShipIn]);
    }
    // if (boardIsEmpty(board))
    return;
  }

  // if (gameState.phase === 'battle') {
  //   foo;
  // }

  return cellID;
};
const game2State = { // possible game states = register, set ,battle, end
  phase: 'set',
  setDone: false,
  completeSet: false,
  currentShipIn: 0,
  activeShipCell: null,
  currentShipOrient: null,
  toggleShipOrient: function () {
    if (this.currentShipOrient === 'H')
      this.currentShipOrient = 'V';
    else
      this.currentShipOrient = 'H';
  }
};

const ships2Available = [
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