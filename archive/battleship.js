const generateBoard = size => {
  let arr = []
  for (let i = 0; i < size; i++) {
    let temp = [];
    for (let j = 0; j < size; j++)
      temp.push('0');
    arr[i] = temp;
  }
  return arr;
};

const placeShipsHorizontal = (board, size, coord) => {
  let arr = Array(size).fill('1');
  board[coord[0]].splice(coord[1], 4, ...arr);
  return;

};

const placeShipsVertical = (board, size, coord) => {
  for (let row = coord[0]; row < coord[0] + size; row++) {
    board[row][coord[1]] = '1';
  }
};

let board = generateBoard(10);
console.log(board);
let coord = [2, 3];

let test = placeShipsHorizontal(board, 4, coord)
console.log(board);
let coord2 = [5, 1];
let test2 = placeShipsVertical(board, 3, coord2);
console.log(board);

let testShot = [5, 1];
const takeShot = (board, coord) => {
  if (board[coord[0]][coord[1]] == '1') {
    let temp = hitShip(board, coord);
  }
}

const hitShip = (board, coord) => {
  board[coord[0]][coord[1]] = 'X';
  console.log('HIT');
}

takeShot(board, testShot);
console.log(board);

module.exports = {
  generateBoard,
  placeShipsHorizontal,
  placeShipsVertical,
  takeShot
};