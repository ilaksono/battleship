const { users, overallState, battleLog, AIMemory } = require("../db/gameState");
const gameHelpers = require("./gameFunctions")(
  users,
  overallState,
  battleLog,
  AIMemory
);

module.exports = () => {
  const setBoard = () => {
    for (const ship of users["Player 2"].ships) setShip(ship);
    users["Player 2"].opBoard = gameHelpers.generateBoard(10);
    users["Player 2"].state.phase = "battle";
  };

  // row 0-9, col 0-9
  const setShip = (ship) => {
    let can = Math.floor(Math.random() * 100);
    let orient = Math.floor(Math.random() * 2);
    const coord = [Math.floor(can / 10), can % 10];
    if (
      gameHelpers.isHorizontalRestricted("Player 2", ship, coord) &&
      gameHelpers.isVerticalRestricted("Player 2", ship, coord)
    )
      return setShip(ship);
    if (orient === 0) {
      if (!gameHelpers.isHorizontalRestricted("Player 2", ship, coord))
        gameHelpers.placeShipsHorizontal("Player 2", ship, coord);
    } else if (orient === 1)
      if (!gameHelpers.isVerticalRestricted("Player 2", ship, coord))
        gameHelpers.placeShipsVertical("Player 2", ship, coord);
  };

  const takeShotAI = () => {
    let can;
    const opponent = "Player 1";
    if (AIMemory.candidates.length === 0) can = Math.floor(Math.random() * 100);
    else if (AIMemory.candidates.length > 0) can = AIMemory.candidates.shift();
    const coord = [Math.floor(can / 10), can % 10];
    console.log(can, coord);
    const hit = gameHelpers.takeShot("Player 1", coord);
    let desc = `AI shoots at ${gameHelpers.convertToBoardNotation(
      can.toString()
    )}: ${hit ? "HIT" : "MISS"} `;
    if (AIMemory.shots.includes(can)) return takeShotAI();
    // if (AIMemory.candidates.includes(can)) "";
    else {
      AIMemory.shots.push(can);
      if (hit) {
        AIMemory.hits.push(can);
        generateCandidatesAI(can);
        if (gameHelpers.sunkShip(hit, users[opponent].board)) {
          users[opponent].ships[hit.charCodeAt(0) - 65].sunk = true;
          desc += `
        AI has sunk a ${gameHelpers.getShipByCode(hit, player).name}`;
          if (gameHelpers.allShipsSunk(opponent)) {
            users["Player 1"].state.phase = "end";
            users["Player 2"].state.phase = "end";
            desc += `${player} has won!`;
            // return res.send(`${player} has won!`);
            const templateVars = {
              user: req.session.userID,
              error: `${player} has won!`,
            };
            return;
          }
        }
      }
      const cpy1 = gameHelpers.createBoardCopy(users["Player 1"].opBoard);
      const cpy2 = gameHelpers.createBoardCopy(users["Player 2"].opBoard);
      battleLog.push({
        turn: battleLog.length + 1,
        boardState: {
          "Player 1": cpy1,
          "Player 2": cpy2,
        },
        desc,
      });
      return;
    }
  };
  const generateCandidatesAI = (can) => {
    const canRow = Math.floor(can / 10);
    const canCol = can % 10;
    if (canRow + 1 < 10) AIMemory.candidates.push(can + 10);
    if (canRow - 1 > 0) AIMemory.candidates.push(can - 10);
    if (canCol + 1 < 10) AIMemory.candidates.push(can + 1);
    if (canCol - 1 > 0) AIMemory.candidates.push(can - 1);
    return;
  };

  return {
    setBoard,
    setShip,
    takeShotAI,
    generateCandidatesAI,
  };
};
