module.exports = (users, overallState, battleLog, AIMemory) => {


  const allShipsSunk = (player) => {
    // console.log(users[player].ships);
    for (const ship of users[player].ships)
      if (ship.sunk === false) return false;

    return true;
  };

  const getShipByCode = (code, player) => {
    let current = player === 'Player 1' ? users['Player 1'].ships : users['Player 2'].ships;
    for (const ship of current)
      if (code === ship.code) return ship;

    return false;
  };

  const confirmShipPlacement = (ship, player) => {

    ship.available = false;
    users[player].state.setDone = true;
    users[player].state.currentShipIn++;
    if (ship.code === 'E') {
      users[player].state.completeSet = true;
      users[player].state.phase = 'battle';
    }

  };

  const sunkShip = (code, board) => {
    for (let row in board) {
      for (let node in board[row]) {
        if (board[row][node] === code) return false;
      }
    }

    return true;
  };

  const toggleShipBoard = (player, index) => {
    if (users[player].ships[index].orientation === 'H') {
      for (let i = 1; i < users[player].ships[index].size; i++) {
        const delta = users[player].ships[index].coordinates[i][1] - users[player].ships[index].coordinates[0][1];
        users[player].board[users[player].ships[index].coordinates[i][0]][users[player].ships[index].coordinates[i][1]] = 0;
        users[player].ships[index].coordinates[i][1] = users[player].ships[index].coordinates[0][1];
        users[player].ships[index].coordinates[i][0] += delta;
        users[player].board[users[player].ships[index].coordinates[i][0]][users[player].ships[index].coordinates[i][1]] =
          users[player].board[users[player].ships[index].coordinates[0][0]][users[player].ships[index].coordinates[0][1]];
      }
      users[player].ships[index].orientation = 'V';
      return;
    }
    else if (users[player].ships[index].orientation === 'V') {
      for (let i = 1; i < users[player].ships[index].size; i++) {
        const delta = users[player].ships[index].coordinates[i][0] - users[player].ships[index].coordinates[0][0];
        users[player].board[users[player].ships[index].coordinates[i][0]][users[player].ships[index].coordinates[i][1]] = 0;
        users[player].ships[index].coordinates[i][0] = users[player].ships[index].coordinates[0][0];
        users[player].ships[index].coordinates[i][1] += delta;
        users[player].board[users[player].ships[index].coordinates[i][0]][users[player].ships[index].coordinates[i][1]] =
          users[player].board[users[player].ships[index].coordinates[0][0]][users[player].ships[index].coordinates[0][1]];
      }
      users[player].ships[index].orientation = 'H';
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

  const convertToCoord = str => { // 00 is [0][0]
    return [parseInt(str[0]), parseInt(str[1])]; // [row#, col#];
  };

  const takeShot = (opponent, coord) => {
    // console.log(users['Player 1'].board, users['Player 2'].board);
    if (users[opponent].board[coord[0]][coord[1]] !== 0) {
      revealShot(opponent, 'HIT', coord);
      const code = users[opponent].board[coord[0]][coord[1]];
      users[opponent].board[coord[0]][coord[1]] = 'X';
      return code;
    }
    users[opponent].board[coord[0]][coord[1]] = 'O';
    revealShot(opponent, 'MISS', coord);
    return false;
  };

  const revealShot = (opponent, candidate, coord) => {
    let player = opponent === 'Player 1' ? 'Player 2' : 'Player 1';
    if (candidate === 'HIT') users[player].opBoard[coord[0]][coord[1]] = 'X';
    else users[player].opBoard[coord[0]][coord[1]] = 'O';
  };

  const placeShipsHorizontal = (player, ship, coord) => {
    let tmp = Array(ship.size).fill(ship.code);
    users[player].board[coord[0]].splice(coord[1], ship.size, ...tmp);
    for (let i = 0; i < ship.size; i++)
      ship.coordinates.push([coord[0], coord[1] + i]);
    ship.orientation = 'H';

    return ship.orientation;

  };

  const isHorizontalRestricted = (player, ship, coord) => {
    if (coord[1] + ship.size > 10) return true;
    for (let i = 1; i < ship.size; i++)
      if (users[player].board[coord[0]][coord[1] + i] !== 0) return true;

    return false;

  };
  const isVerticalRestricted = (player, ship, coord) => {
    if (coord[0] + ship.size > 10) return true;
    for (let i = 1; i < ship.size; i++)
      if (users[player].board[coord[0] + i][coord[1]] !== 0) return true;

    return false;

  };

  const placeShipsVertical = (player, ship, coord) => {
    for (let row = coord[0]; row < coord[0] + ship.size; row++) {
      users[player].board[row][coord[1]] = ship.code;
      ship.coordinates.push([coord[0] + row, coord[1]]);
    }
    ship.orientation = 'V';
    return ship.orientation;
  };

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

  const calculateTime = (time) => {
    const now = new Date().getTime();
    return now - time;
  }

  const convertToBoardNotation = coord => `${String.fromCharCode(65 + Number(coord[1]))}${Number(coord[0]) + 1}`;

  const playAgain = () => {
    let game2State = { // possible game states = register, set ,battle, end
      phase: 'set',
      setDone: true,
      completeSet: false,
      currentShipIn: 0,
      activeShipCell: null,
      currentShipOrient: null,
      toggleShipOrient: function () {
        if (this.currentShipOrient === 'H')
          this.currentShipOrient = 'V';
        else
          this.currentShipOrient = 'H';
      },
    };
    for(let i = 0; i < battleLog.length; i++) {
      battleLog.shift();
      i--;
    }

    let ships2Available = [
      {
        available: true,
        size: 2,
        code: 'A',
        sunk: false,
        name: 'Destroyer',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 3,
        code: 'B',
        sunk: false,
        name: 'Submarine',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 3,
        code: 'C',
        sunk: false,
        name: 'Cruiser',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 4,
        code: 'D',
        sunk: false,
        name: 'Battleship',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 5,
        code: 'E',
        sunk: false,
        name: 'Carrier',
        coordinates: [],
        orientation: null
      }
    ];

    let game1State = { // possible game states = register, set ,battle, end
      phase: 'set',
      setDone: true,
      completeSet: false,
      currentShipIn: 0,
      activeShipCell: null,
      currentShipOrient: null,
      toggleShipOrient: function () {
        if (this.currentShipOrient === 'H')
          this.currentShipOrient = 'V';
        else
          this.currentShipOrient = 'H';
      },
    };

    let ships1Available = [
      {
        available: true,
        size: 2,
        code: 'A',
        sunk: false,
        name: 'Destroyer',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 3,
        code: 'B',
        sunk: false,
        name: 'Submarine',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 3,
        code: 'C',
        sunk: false,
        name: 'Cruiser',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 4,
        code: 'D',
        sunk: false,
        name: 'Battleship',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 5,
        code: 'E',
        sunk: false,
        name: 'Carrier',
        coordinates: [],
        orientation: null
      }
    ];
    users["Player 1"] = { name: users['Player 1'].name, id: 'Player 1', board: generateBoard(10), opBoard: generateBoard(10), state: game1State, moves: [], hits: [], ships: ships1Available, heart: "" };
      users["Player 2"] = { name: users['Player 2'].name, id: 'Player 2', board: generateBoard(10), opBoard: generateBoard(10), state: game2State, moves: [], hits: [], ships: ships2Available, heart: "" };
  };
  const resetAll = () => {

    let game2State = { // possible game states = register, set ,battle, end
      phase: 'register',
      setDone: true,
      completeSet: false,
      currentShipIn: 0,
      activeShipCell: null,
      currentShipOrient: null,
      toggleShipOrient: function () {
        if (this.currentShipOrient === 'H')
          this.currentShipOrient = 'V';
        else
          this.currentShipOrient = 'H';
      },
    };

    for(let i = 0; i < battleLog.length; i++) {
      battleLog.shift();
      i--;
    }

    let ships2Available = [
      {
        available: true,
        size: 2,
        code: 'A',
        sunk: false,
        name: 'Destroyer',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 3,
        code: 'B',
        sunk: false,
        name: 'Submarine',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 3,
        code: 'C',
        sunk: false,
        name: 'Cruiser',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 4,
        code: 'D',
        sunk: false,
        name: 'Battleship',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 5,
        code: 'E',
        sunk: false,
        name: 'Carrier',
        coordinates: [],
        orientation: null
      }
    ];

    let game1State = { // possible game states = register, set ,battle, end
      phase: 'register',
      setDone: true,
      completeSet: false,
      currentShipIn: 0,
      activeShipCell: null,
      currentShipOrient: null,
      toggleShipOrient: function () {
        if (this.currentShipOrient === 'H')
          this.currentShipOrient = 'V';
        else
          this.currentShipOrient = 'H';
      },
    };

    let ships1Available = [
      {
        available: true,
        size: 2,
        code: 'A',
        sunk: false,
        name: 'Destroyer',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 3,
        code: 'B',
        sunk: false,
        name: 'Submarine',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 3,
        code: 'C',
        sunk: false,
        name: 'Cruiser',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 4,
        code: 'D',
        sunk: false,
        name: 'Battleship',
        coordinates: [],
        orientation: null
      },
      {
        available: true,
        size: 5,
        code: 'E',
        sunk: false,
        name: 'Carrier',
        coordinates: [],
        orientation: null
      }
    ];
    AIMemory.shots = [];
    AIMemory.hits = [];
    AIMemory.candidates = [];

    const overallState = {
      playerTurn: 1,
      // phases 0: register, 0.5: registerDone, 1:set, 1.5: setDone, 2: battle, 3: end
    };

    users["Player 1"] = { name: '', id: '', board: [], opBoard: [], state: game1State, moves: [], hits: [], ships: ships1Available, heart: "" };
    users["Player 2"] = { name: '', id: '', board: [], opBoard: [], state: game2State, moves: [], hits: [], ships: ships2Available, heart: "" };
  };

  const createBoardCopy = board => {
    let arr = [];
    for(let a of board) {
      let temp = [...a];
      arr.push(temp);
    }
    return arr;
  }




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
    generateBoard,
    convertToBoardNotation,
    playAgain,
    resetAll,
    isHorizontalRestricted,
    isVerticalRestricted,
    placeShipsVertical,
    calculateTime,
    createBoardCopy
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
