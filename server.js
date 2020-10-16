const express = require("express");
const port = 8080;
const cookieSession = require("cookie-session");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cpu = require("./helpers/computer")();
const { users, overallState, battleLog, AIMemory } = require("./db/gameState");
const gameHelpers = require("./helpers/gameFunctions")(
  users,
  overallState,
  battleLog,
  AIMemory
);

const app = express();
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["itsASecret", "JKLUL"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

const whichPlayer = (userDB, playerID) => {
  if (userDB["Player 1"].id === playerID) return "Player 1";
  return "Player 2";
};
app.get("/register", (req, res) => {
  user = req.session.userID || "";
  res.render("user_registration", { error: "", user });
});

app.post("/register", (req, res) => {
  let player;
  if (!users["Player 1"].id) player = "Player 1";
  else player = "Player 2";
  let username = req.body.username;
  req.session.userID = player;
  users[player].id = req.session.userID;
  users[player].name = username;
  users[player].board = gameHelpers.generateBoard(10);
  users[player].state.phase = "set";
  if (player === "Player 1") {
    const heartBeat1 = setInterval(() => {
      if (gameHelpers.calculateTime(users["Player 1"].heart) > 15000) {
        gameHelpers.resetAll();
        clearInterval(heartBeat1);
      }
    }, 120000);
  } else if (player === "Player 2") {
    const heartbeat2 = setInterval(() => {
      if (gameHelpers.calculateTime(users["Player 2"].heart) > 15000) {
        gameHelpers.resetAll();
        clearInterval(heartbeat2);
      }
    }, 120000);
  }
  res.redirect("/");
});

app.get("/", (req, res) => {
  if (!(users["Player 1"].name && users["Player 2"].name)) {
    if (
      req.session.userID === users["Player 1"].id ||
      req.session.userID === users["Player 2"].id
    )
      return res.render("waiting_page");
    return res.redirect("/register");
  }
  if (
    users["Player 1"].state.phase === "set" &&
    users["Player 2"].state.phase === "set"
  )
    return res.redirect("/set");
  if (
    users["Player 1"].state.phase === "set" ||
    users["Player 2"].state.phase === "set"
  ) {
    if (users[req.session.userID].state.phase === "battle")
      return res.render("waiting_page");
  }
  if (
    users["Player 1"].state.phase === "battle" &&
    users["Player 2"].state.phase === "battle"
  )
    return res.redirect("/battle");
});

app.post("/", (req, res) => {
  res.redirect("/");
});

app.get("/set", (req, res) => {
  const user = users[req.session.userID];
  const templateVars = {
    user,
    number: `board${req.session.userID[7]}`,
    error: "",
  };
  res.render("set_page", templateVars);
});

app.put("/set/:node", (req, res) => {
  let player = req.session.userID;
  const cellID = req.params.node;
  const user = users[req.session.userID];
  const coord = gameHelpers.convertToCoord(req.params.node); // converts e.g.'A1' to [0, 0]
  if (users[player].state.phase === "set") {
    if (users[player].state.setDone) {
      if (gameHelpers.isHorizontalRestricted(player, users[player].ships[users[player].state.currentShipIn], coord)
        && !gameHelpers.isVerticalRestricted(player, users[player].ships[users[player].state.currentShipIn], coord)) {
        gameHelpers.placeShipsVertical(player, users[player].ships[users[player].state.currentShipIn], coord);
        users[player].state.currentShipOrient = "H";
        gameHelpers.confirmShipPlacement(users[player].ships[users[player].state.currentShipIn], player);
        const templateVars = {
          user,
          number: `board${req.session.userID[7]}`,
          error: "Horizontally restricted, confirmed placement.",
        };
        if (!users[player].ships[4].available) {
          users[player].state.phase = "battle";
          users[player].opBoard = gameHelpers.generateBoard(10);
          return res.redirect("/battle");
        }
        return res.render("set_page", templateVars);
      } else if (
        gameHelpers.isHorizontalRestricted(player, users[player].ships[users[player].state.currentShipIn], coord
        ) && gameHelpers.isVerticalRestricted(player, users[player].ships[users[player].state.currentShipIn], coord)) {
        const templateVars = {
          user,
          number: `board${req.session.userID[7]}`,
          error: "Restricted both ways, try again",
        };
        return res.render("set_page", templateVars);
      }
      users[player].state.setDone = false;
      gameHelpers.placeShipsHorizontal(player, users[player].ships[users[player].state.currentShipIn], coord);
      users[player].state.activeShipCell = cellID;
      users[player].state.currentShipOrient = "H";
      let error = "";
      if (gameHelpers.isVerticalRestricted(player, users[player].ships[users[player].state.currentShipIn], coord)) {
        gameHelpers.confirmShipPlacement(users[player].ships[users[player].state.currentShipIn], player);
        error = "Vertically restricted, confirmed placement";
      }
      if (!users[player].ships[4].available) {
        users[player].state.phase = "battle";
        users[player].opBoard = gameHelpers.generateBoard(10);
        return res.redirect("/battle");
      }
      const templateVars = {
        user,
        number: `board${req.session.userID[7]}`,
        error,
      };
      return res.render("set_page", templateVars);
    } else if (
      users[player].ships[4].available === true &&
      !users[player].state.setDone
    ) {
      //
      if (cellID === users[player].state.activeShipCell) {
        gameHelpers.toggleShipBoard(player, users[player].state.currentShipIn);
        return res.redirect("/set");
      } else if (cellID !== users[player].state.activeShipCell) {
        gameHelpers.confirmShipPlacement(
          users[player].ships[users[player].state.currentShipIn],
          player
        );
        if (!users[player].ships[4].available) {
          users[player].state.phase = "battle";
          users[player].opBoard = gameHelpers.generateBoard(10);
          return res.redirect("/battle");
        }
        return res.redirect("/set");
      }
    }
  }
});

//req.session.userID = 'Player 1' || 'Player 2'
app.get("/set/ready", (req, res) => {
  users[req.session.userID].state.phase = "battle";
  res.redirect("/battle");
});

app.post("/set/ready", (req, res) => {
  users[req.session.userID].state.phase = "battle";
  res.redirect("/battle");
});

app.get("/board", (req, res) => {
  // console.log(users['Player 1'].board, users['Player 2'].board);

  player = req.session.userID;
  const opponent = req.session.userID === "Player 1" ? "Player 2" : "Player 1";
  if (gameHelpers.allShipsSunk(opponent)) {
    const templateVars = {
      user: req.session.userID,
      error: `${player} has won!`,
    };
    return res.json({ url: "/play_again" });
  } else if (gameHelpers.allShipsSunk(player)) {
    const templateVars = {
      user: req.session.userID,
      error: `${opponent} has won!`,
    };
    return res.json({ url: "/play_again" });
  }

  return res.status(200).json({
    myBoard: users[req.session.userID].board,
    opBoard: users[req.session.userID].opBoard,
    battleLog,
    error: ''
  });
});

app.get("/battle", (req, res) => {
  let opponent;
  if (req.session.userID === "Player 1") opponent = users["Player 2"];
  else opponent = users["Player 1"];
  if (
    users["Player 1"].state.phase !== "battle" ||
    users["Player 2"].state.phase !== "battle"
  )
    return res.redirect("/");
  const user = users[req.session.userID];
  const templateVars = {
    user,
    number: `board${req.session.userID[7]}`,
    error: "",
    battleLog,
  };
  return res.status(200).render("battle_page", templateVars);
});
app.get("/db.json", (req, res) => {
  res.json({ users, battleLog });
});

app.post("/single", (req, res) => {
  const player = "Player 1";
  req.session.userID = "Player 1";
  users[player].id = req.session.userID;
  users[player].name = "Jack Sparrow";
  users[player].board = gameHelpers.generateBoard(10);
  users[player].state.phase = "set";
  const heartBeat1 = setInterval(() => {
    if (gameHelpers.calculateTime(users["Player 1"].heart) > 15000) {
      gameHelpers.resetAll();
      clearInterval(heartBeat1);
    }
  }, 120000); // 2 minutes
  users["Player 2"].id = "Player 2";
  users["Player 2"].name = "CPULUL";
  users["Player 2"].board = gameHelpers.generateBoard(10);
  cpu.setBoard();
  res.redirect("/set");
});

app.post("/battle/:id", (req, res) => {
  const player = req.session.userID;
  let user = users[player];
  const cellID = req.params.id;
  const coord = gameHelpers.convertToCoord(cellID);
  let opponent;
  if (req.session.userID === "Player 1") opponent = "Player 2";
  else opponent = "Player 1";

  if (
    users["Player 1"].state.phase === "battle" ||
    users["Player 2"].state.phase === "battle"
  ) {
    if ((battleLog.length % 2) + 1 === Number(player[7])) {
      let hit = gameHelpers.takeShot(opponent, coord);
      let desc = `${player} shoots at ${gameHelpers.convertToBoardNotation(
        cellID
      )}: ${hit ? "HIT" : "MISS"} `;
      if (hit) {
        if (gameHelpers.sunkShip(hit, users[opponent].board)) {
          users[opponent].ships[hit.charCodeAt(0) - 65].sunk = true;
          desc += `
          ${player} has sunk a ${gameHelpers.getShipByCode(hit, player).name}`;
          if (gameHelpers.allShipsSunk(opponent)) {
            users["Player 1"].state.phase = "end";
            users["Player 2"].state.phase = "end";
            desc += `${player} has won!`;
            const templateVars = {
              user: req.session.userID,
              error: `${player} has won!`,
            };
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
            return res.status(200).render("play_again", templateVars);
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
      if (users["Player 2"].name === "CPULUL") {
        const AIShot = cpu.takeShotAI();
        if (AIShot === "LOST") {
          const templateVars = {
            user: req.session.userID,
            error: `AI has won!`,
          };
          return res.status(200).render("play_again", templateVars);
        }

      }
      // return res.status(200).redirect("/battle");
      return res.status(200).json({ error: '' });

    } else {
      return res.status(400).json({
        error: `Waiting on ${opponent}`,
        user,
        number: `board${req.session.userID[7]}`,
        battleLog,
      });
    }
  } else {
    const templateVars = {
      user: req.session.userID,
      error: `${player} has lost!`,
    };
    return res.render("play_again", templateVars);
  }
});
app.get("/play_again", (req, res) => {
  const player = req.session.userID;
  const opponent = req.session.userID === "Player 1" ? "Player 2" : "Player 1";
  if (gameHelpers.allShipsSunk(opponent)) {
    const templateVars = {
      user: req.session.userID,
      error: `${player} has won!`,
    };
    return res.render("play_again", templateVars);
  } else if (gameHelpers.allShipsSunk(player)) {
    const templateVars = {
      user: req.session.userID,
      error: `${opponent} has won!`,
    };
    return res.render("play_again", templateVars);
  }
});

app.get("/heart", (req, res) => {
  users[req.session.userID].heart = new Date().getTime();
  res.json({ time: users[req.session.userID].heart });
});
app.get("/plays", (req, res) => {
  res.json(battleLog);
});

app.get("/play-again", (req, res) => {
  if (users['Player 2'].name === 'CPULUL') {
    cpu.playAgainSingle();
    return res.redirect('/set');
  }
  gameHelpers.playAgain();
  res.redirect("/set");
});

app.get("/replay", (req, res) => {
  res.render("replay_page", {
    battleLog,
    user: users[req.session.userID].name,
  });
});


app.listen(port, () => {
  console.log("listening ", port);
});
