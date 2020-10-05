// let A = [
//   [1,2,3],
//   [4,5,6],
//   [7,8,9]
// ]

// console.log(A);
// A[2][1] = A[2][0];

// console.log(A);
// A[2][1] = 'E';

// console.log(A);
// const A = 'Destroyer'

// let str = `HIT`;
// str += `Sunk ${A}`;
// console.log(str);

const obj = {
  a: 1,
  b: 2,
  c: 3
}

const bigObj = {
  a: 3,
  c: 7,
  d: obj
}

bigObj.d.c = 5;
// obj = {
//   b: 2,
//   c: 3
// };
console.log(obj);