// board1.onclick = (evt) => {
//   const player = 'Player 1';
//   const cellID = evt.target.id;
//   const coord = convertToCoord(cellID); // converts e.g.'A1' to [0, 0]
//   if (gameState.phase === 'set') {
//     if (shipsAvailable && gameState.setDone) {
//       gameState.setDone = false;
//       placeShipsHorizontal(player, shipsAvailable[gameState.currentShipIn], coord);
//       gameState.activeShipCell = cellID;
//       gameState.currentShipOrient = 'H';
//       return;
//     } else if (shipsAvailable[4].available === true && !gameState.setDone) { // 
//       if (cellID === gameState.activeShipCell)
//         return toggleShipBoard(shipsAvailable[currentShipIn]);
//       else if (cellID !== gameState.activeShipCell)
//         return confirmShipPlacement(shipsAvailable[currentShipIn]);
//     }
//     return;
//   }

//   if (game1State.phase === 'battle' && game2State.phase === 'battle') {
//     if (overallState.playerTurn === 2) {
//       let hit = takeShot(users[player].board, coord);
//       // let sunk = sunkShip()
//       battleLog.push(`Player 2 shoots at ${cellID}: ${hit ? 'HIT' : 'MISS'}`);
//       if(hit) {
//         if(sunkShip(hit)) battleLog.push(`Player 2 has sunk a ${getShipByCode(hit, 'Player 2').name}`)
//       }
//       if (allShipsSunk('Player 1')) {
//         overallState = 'end'
//         battleLog.push(`Player 2 has won!`);
//         return;
//       }
//     } else {
//       return `Waiting on ${users['Player 1'].name}`;
//     }
//   }

//   return cellID;
// };
// let battleLog = [];

// const overallState = {
//   playerTurn: 1,
// phases 0: register, 0.5: registerDone, 1:set, 1.5: setDone, 2: battle, 3: end
// };
// const users = {
//   "Player 1": { name: '', id: '', board: [], state: 'register', moves: [], hits: [], ships: ships1Available },
//   "Player 2": { name: '', id: '', board: [], state: 'register', moves: [], hits: [], ships: ships2Available }
// };

module.exports = () => {
  const allShipsSunk = (player) => {
    for (let ship in users[player].ships)
      if (ship.sunk === false) return false;

    return true;
  };

  // let game1State = { // possible game states = register, set ,battle, end
  //   phase: 'set',
  //   setDone: false,
  //   completeSet: false,
  //   currentShipIn: 0,
  //   activeShipCell: null,
  //   currentShipOrient: null,
  //   toggleShipOrient: function () {
  //     if (this.currentShipOrient === 'H')
  //       this.currentShipOrient = 'V';
  //     else
  //       this.currentShipOrient = 'H';
  //   },
  //   playerTurn: 1,
  // };

  // let ships1Available = [
  //   {
  //     available: true,
  //     size: 2,
  //     code: 'A',
  //     sunk: false,
  //     name: 'Destroyer',
  //     coordinates: [],
  //     orientation: null
  //   },
  //   {
  //     available: true,
  //     size: 3,
  //     code: 'B',
  //     sunk: false,
  //     name: 'Submarine',
  //     coordinates: [],
  //     orientation: null
  //   },
  //   {
  //     available: true,
  //     size: 3,
  //     code: 'C',
  //     sunk: false,
  //     name: 'Cruiser',
  //     coordinates: [],
  //     orientation: null
  //   },
  //   {
  //     available: true,
  //     size: 4,
  //     code: 'D',
  //     sunk: false,
  //     name: 'Battleship',
  //     coordinates: [],
  //     orientation: null
  //   },
  //   {
  //     available: true,
  //     size: 5,
  //     code: 'E',
  //     sunk: false,
  //     name: 'Carrier',
  //     coordinates: [],
  //     orientation: null
  //   }
  // ];

  const getShipByCode = (code, player) => {
    let current = player === 'Player 1' ? ships1Available : ships2Available;
    for (const ship of current) {
      if (code === ship.code)
        return ship;
    }
    return false;
  };

  const confirmShipPlacement = (ship) => {

    ship.available = false;
    gameState.setDone = true;
    gameState.currentShipIn++;
    if (ship.code === 'E') {
      gameState.completeSet = true;
      gameState.phase = 'battle';
    }

  };

  const sunkShip = (code, board) => {
    for (let row in board) {
      for (let node in row) {
        if (board[row][node] === code) return false;
      }
    }
    return true;
  };

  // btnConfirm.onclick = (evt) => {
  //   if (allShipsSet(shipsAvailable) && gameState.phase === 'set')
  //     gameState.phase = 'battle';
  // };

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
    else if (ship.orientation === 'V') {
      for (let i = 1; i < ship.size; i++) {
        const delta = ship.coordinates[i][0] - ship.coordinates[0][0];
        ship.coordinates[i][0] = ship.coordinates[0][0];
        ship.coordinates[i][1] += delta;
      }
      ship.orientation = 'H';
      return;
    }
  };

  const allShipsSet = (shipArr) => {
    for (let ship of shipArr) {
      if (ship.available) return false;
    }
    return true;
  };



  const recordMove = (id, player) => `${player} shoots at ${id}: ${takeShot(convertToCoord(board, id)) ? 'HIT' : 'MISS'}`;

  const convertToCoord = str => {
    let col = String.charCodeAt(str[0]) - 65;
    let row = Number([...id].slice(1)) - 1;
    return [row, col];
  };

  const takeShot = (board, coord) => {
    if (board[coord[0]][coord[1]] !== 0) {
      return board[coord[0]][coord[1]];
    } else
      return false;

  };

  // const hitShip = (coord, board) => {
  //   board[coord[0]][coord[1]] = 'X';
  //   console.log('HIT');
  // };

  const placeShipsHorizontal = (player, ship, coord) => {
    let tmp = Array(ship.size).fill(ship.code);
    users[player].board[coord[0]].splice(coord[1], ship.size, ...tmp);
    for (let i = 0; i < ship.size; i++)
      ship.coordinates.push([coord[0], coord[1] + i]);
    ship.orientation = 'H';

    return ship.orientation;

  };

  // const placeShipsVertical = (board, ship, coord) => {
  //   for (let row = coord[0]; row < coord[0] + ship.size; row++)
  //     board[row][coord[1]] = ship.code;
  //   return board;
  // };
  // const placeShip = (board, size, coord, orient) => {
  //   if (orient) return placeShipsHorizontal(board, size, coord);
  //   else return placeShipsVertical(board, size, corod);

  // };

  // verify.onclick = (evt) => {

  // };;


  const generateBoard = size => {
    let arr = [];
    for (let i = 0; i < size; i++) {
      let temp = [];
      for (let j = 0; j < size; j++)
        temp.push(0);
      arr[i] = temp;
    }
    return arr;
  };
  return {
    allShipsSunk,
    getShipByCode,
    confirmShipPlacement,
    sunkShip,
    toggleShipBoard,
    allShipsSet,
    recordMove,
    convertToCoord,
    takeShot,
    placeShipsHorizontal,
    generateBoard
  };
};
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

// board2.onclick = (evt) => {
//   const player = 'Player 2';
//   const cellID = evt.target.id;
//   const coord = convertToCoord(cellID); // converts e.g.'A1' to [0, 0]
//   if (gameState.phase === 'set') {
//     if (shipsAvailable && gameState.setDone) {
//       gameState.setDone = false;
//       placeShipsHorizontal(gameBoard, shipsAvailable[gameState.currentShipIn], coord);
//       gameState.activeShipCell = cellID;
//       gameState.currentShipOrient = 'H';
//       return gameBoard;
//     } else if (shipsAvailable[4].available === true && !gameState.setDone) { //
//       if (cellID === gameState.activeShipCell)
//         return toggleShipBoard(shipsAvailable[currentShipIn]);
//       else if (cellID !== gameState.activeShipCell)
//         return confirmShipPlacement(shipsAvailable[currentShipIn]);
//     }
//     return;
//   }

//   if (game1State.phase === 'battle' && game2State.phase === 'battle') {
//     if (overallState.playerTurn === 1) {
//       let hit = takeShot(users[player].board, coord);
//       battleLog.push(`Player 1 shoots at ${cellID}: ${hit ? 'HIT' : 'MISS'}`);
//       if(hit) {
//         if(sunkShip(hit)) battleLog.push(`Player 1 has sunk a ${getShipByCode(hit, 'Player 1').name}`)
//       }
//       if (allShipsSunk('Player 2')) {
//         overallState = 'end'
//         battleLog.push(`Player 1 has won!`);
//         return;
//       }
//     } else {
//       return `Waiting on ${users['Player 2'].name}`;
//     }
//   }

//   return cellID;
// };
// const game2State = { // possible game states = register, set ,battle, end
//   phase: 'set',
//   setDone: false,
//   completeSet: false,
//   currentShipIn: 0,
//   activeShipCell: null,
//   currentShipOrient: null,
//   toggleShipOrient: function () {
//     if (this.currentShipOrient === 'H')
//       this.currentShipOrient = 'V';
//     else
//       this.currentShipOrient = 'H';
//   }
// };

// const ships2Available = [
//   {
//     available: true,
//     size: 2,
//     code: 'A',
//     coordinates: [],
//     orientation: null
//   },
//   {
//     available: true,
//     size: 3,
//     code: 'B',
//     coordinates: [],
//     orientation: null
//   },
//   {
//     available: true,
//     size: 3,
//     code: 'C',
//     coordinates: [],
//     orientation: null
//   },
//   {
//     available: true,
//     size: 4,
//     code: 'D',
//     coordinates: [],
//     orientation: null
//   },
//   {
//     available: true,
//     size: 5,
//     code: 'E',
//     coordinates: [],
//     orientation: null
//   }
// ];