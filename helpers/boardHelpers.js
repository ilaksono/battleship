// module.exports = () => {

//   const generateBoard = size => {
//     let arr = [];
//     for (let i = 0; i < size; i++) {
//       let temp = [];
//       for (let j = 0; j < size; j++)
//         temp.push('0');
//       arr[i] = temp;
//     }
//     return arr;
//   };


  


  

//   // let board = generateBoard(10);
//   // console.log(board);
//   // let coord = [2, 3];

//   // let test = placeShipsHorizontal(board, 4, coord)
//   // console.log(board);
//   // let coord2 = [5, 1];
//   // let test2 = placeShipsVertical(board, 3, coord2);
//   // console.log(board);

//   // let testShot = [5, 1];

//   const hitShip = (coord, board) => {
//     board[coord[0]][coord[1]] = 'X';
//     console.log('HIT');
//   };

//   // takeShot(board, testShot);
//   // console.log(board);A

//   return {
//     generateBoard,
//     placeShipsHorizontal,
//     placeShipsVertical,
//     hitShip,
//     takeShot
//   };

// };
// module.exports = {
//   generateBoard,
//   placeShipsHorizontal,
//   placeShipsVertical,
//   takeShot
// };