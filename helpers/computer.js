const gameHelpers = require('./gameFunctions');

module.exports = () => {
    const setBoard = () => {
      for (const ship of users['Player 2'].ships)
        setShip(ship);
      users['Player 2'].state.phase = 'battle';
      users['Player 2'].opBoard = gameHeleprs.generateBoard(10);
    };
  
  
  // row 0-9, col 0-9
    const setShip = (ship) => {
      let can = Math.floor(Math.random() * 100);
      let orient = Math.floor(Math.random() * 2);
      const coord = [Math.floor(can / 10), can % 10];
      if (gameHelpers.isHorizontalRestricted('Player 2', ship, coord) && gameHelpers.isVerticalRestricted('Player 2', ship, coord))
        return setShip(ship);
      if(orient === 0) {
        if (!gameHelpers.isHorizontalRestricted('Player 2', ship, coord))
          gameHelpers.placeShipsHorizontal('Player 2', ship, coord);
      } else if(orient === 1)
        if (!gameHelpers.isVerticalRestricted('Player 2', ship, coord))
          gameHelpers.placeShipsVertical('Player 2'. ship, coord);
    };

    const takeShotAI = () => {
      const can = Math.floor(Math.random() * 100);
      const coord = [Math.floor(can / 10), can % 10];
      const hit = takeShot('Player 1', coord);

    }
  
    return {};
};
  