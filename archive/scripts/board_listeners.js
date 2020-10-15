const { users, battleLog } = require('../../db/gameState');
const gameHelpers = require('../../helpers/gameFunctions')(users, battleLog);


board1.onclick = (evt) => {
  const player = 'Player 1';
  const cellID = evt.target.id;
  const coord = gameHelpers.convertToCoord(cellID); // converts e.g.'A1' to [0, 0]
  if (users['Player 1'].state.phase === 'set') {
    if (shipsAvailable && users['Player 1'].state.setDone) {
      users['Player 1'].state.setDone = false;
      gameHelpers.placeShipsHorizontal(player, shipsAvailable[users['Player 1'].state.currentShipIn], coord);
      users['Player 1'].state.activeShipCell = cellID;
      users['Player 1'].state.currentShipOrient = 'H';
      return;
    } else if (shipsAvailable[4].available === true && !users['Player 1'].state.setDone) { // 
      if (cellID === users['Player 1'].state.activeShipCell)
        return gameHelpers.toggleShipBoard(shipsAvailable[currentShipIn]);
      else if (cellID !== users['Player 1'].state.activeShipCell)
        return gameHelpers.confirmShipPlacement(shipsAvailable[currentShipIn]);
    }
    return;
  }

  if (users['Player 1'].state.phase === 'battle' && users['Player 2'].state.phase === 'battle') {
    if (overallState.playerTurn === 2) {
      let hit = gameHelpers.takeShot(users[player].board, coord);
      // let sunk = sunkShip()
      battleLog.push(`Player 2 shoots at ${cellID}: ${hit ? 'HIT' : 'MISS'}`);
      if (hit) {
        if (gameHelpers.sunkShip(hit)) battleLog.push(`Player 2 has sunk a ${gameHelpers.getShipByCode(hit, 'Player 2').name}`);
      }
      if (gameHelpers.allShipsSunk('Player 1')) {
        overallState = 'end';
        battleLog.push(`Player 2 has won!`);
        return;
      }
      overallState.playerTurn = 1;
    } else {
      return `Waiting on ${users['Player 1'].name}`;
    }
  }

  return cellID;
};

board2.onclick = (evt) => {
  const player = 'Player 2';
  const cellID = evt.target.id;
  const coord = gameHelpers.convertToCoord(cellID); // converts e.g.'A1' to [0, 0]
  if (gameState.phase === 'set') {
    if (shipsAvailable && gameState.setDone) {
      gameState.setDone = false;
      gameHelpers.placeShipsHorizontal(gameBoard, shipsAvailable[gameState.currentShipIn], coord);
      gameState.activeShipCell = cellID;
      gameState.currentShipOrient = 'H';
      return gameBoard;
    } else if (shipsAvailable[4].available === true && !gameState.setDone) { // 
      if (cellID === gameState.activeShipCell)
        return gameHelpers.toggleShipBoard(shipsAvailable[currentShipIn]);
      else if (cellID !== gameState.activeShipCell)
        return gameHelpers.confirmShipPlacement(shipsAvailable[currentShipIn]);
    }
    return;
  }
  if (game1State.phase === 'battle' && game2State.phase === 'battle') {
    if (overallState.playerTurn === 1) {
      let hit = gameHelpers.takeShot(users[player].board, coord);
      battleLog.push(`Player 1 shoots at ${cellID}: ${hit ? 'HIT' : 'MISS'}`);
      if (hit) {
        if (gameHelpers.sunkShip(hit)) battleLog.push(`Player 1 has sunk a ${gameHelpers.getShipByCode(hit, 'Player 1').name}`);
      }
      if (gameHelpers.allShipsSunk('Player 2')) {
        overallState = 'end';
        battleLog.push(`Player 1 has won!`);
        return;
      }
      overallState.playerTurn = 2;
    } else {
      return `Waiting on ${users['Player 2'].name}`;
    }
  }

  return cellID;
};