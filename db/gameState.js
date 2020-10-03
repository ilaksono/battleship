let game2State = { // possible game states = register, set ,battle, end
  phase: 'register',
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
  },
};

let battleLog = [];

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
const overallState = {
  playerTurn: 1,
  // phases 0: register, 0.5: registerDone, 1:set, 1.5: setDone, 2: battle, 3: end
};

const users = {
  "Player 1": { name: '', id: '', board: [], state: game1State, moves: [], hits: [], ships: ships1Available },
  "Player 2": { name: '', id: '', board: [], state: game2State, moves: [], hits: [], ships: ships2Available }
};

module.exports = { users, overallState, battleLog }