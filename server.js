const express = require('express');
const port = 8080;
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const generateID = () => Math.random().toString(36).substring(2, 8);

const { users, overallState, battleLog } = require('./db/gameState');
const gameHelpers = require('./helpers/gameFunctions')(users, overallState, battleLog);

const app = express();
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['itsASecret', 'JKLUL'],
}));
app.use(bodyParser.urlencoded({ extended: true }));
const boardHelpers = require('./helpers/boardHelpers');


app.use(methodOverride('_method'));

// const users = {
//   "Player 1": { name: '', id: '', board: [], state: 'register', moves: [], hits: [], ships: ships1Available },
//   "Player 2": { name: '', id: '', board: [], state: 'register', moves: [], hits: [], ships: ships2Available }
// };

const whichPlayer = (userDB, playerID) => {
  if (userDB['Player 1'].id === playerID) return 'Player 1';
  return 'Player 2';
};
app.get('/register', (req, res) => {
  user = req.session.userID || '';
  res.render('user_registration', { error: '', user });
});

app.post('/register', (req, res) => {
  let player;
  if (!users['Player 1'].id) player = 'Player 1';
  else player = 'Player 2';
  let username = req.body.username;
  req.session.userID = player;
  users[player].id = req.session.userID;
  users[player].name = username;
  users[player].board = gameHelpers.generateBoard(10);
  users[player].state.phase = 'set';
  console.log(req.session.userID);
  res.redirect('/');
});

app.get('/', (req, res) => {
  if (!(users['Player 1'].name && users['Player 2'].name)) {
    if (req.session.userID === users['Player 1'].id || req.session.userID === users['Player 2'].id)
      return res.send('Please wait for other player');
    return res.redirect('/register');
  }
  // res.render('play_page', templateVars);
  res.redirect('/set');
});

app.post('/', (req, res) => {

  res.redirect('/');
});

app.get('/set', (req, res) => {
  const user = users[req.session.userID];
  const templateVars = {
    user,
    number: `board${req.session.userID[7]}`
  };
  res.render('set_page', templateVars);
});



app.put('/set/:node', (req, res) => {
  let player = req.session.userID;
  const cellID = req.params.node;
  const user = users[req.session.userID];
  const coord = gameHelpers.convertToCoord(req.params.node); // converts e.g.'A1' to [0, 0]
  if (users[player].state.phase === 'set') {
    if (users[player].state.setDone) {
      users[player].state.setDone = false;
      gameHelpers.placeShipsHorizontal(player, users[player].ships[users[player].state.currentShipIn], coord);
      users[player].state.activeShipCell = cellID;
      users[player].state.currentShipOrient = 'H';
      const templateVars = {
        user,
        number: `board${req.session.userID[7]}`
      };
      return res.render('set_page', templateVars);
    } else if (users[player].ships[4].available === true && !users[player].state.setDone) { // 
      if (cellID === users[player].state.activeShipCell) {
        gameHelpers.toggleShipBoard(player, users[player].state.currentShipIn);
        // const templateVars = {
        //   user,
        //   number: `board${req.session.userID[6]}`
        // };
        return res.redirect('/set');
      }
      else if (cellID !== users[player].state.activeShipCell) {
        gameHelpers.confirmShipPlacement(users[player].ships[users[player].state.currentShipIn], player);
        if (!users[player].ships[4].available) {
          users[player].state.phase = 'battle';
          users[player].opBoard = gameHelpers.generateBoard(10);
          return res.redirect('/battle');
        }
        return res.redirect('/set');
      }
    }
  }

  // if(users[player].state.setDone)
});

//req.session.userID = 'Player 1' || 'Player 2'
app.get('/set/ready', (req, res) => {
  users[req.session.userID].state.phase = 'battle';
  res.redirect('/battle');
});

app.post('/set/ready', (req, res) => {
  users[req.session.userID].state.phase = 'battle';
  res.redirect('/battle');
});

app.get('/battle', (req, res) => {

  let opponent;
  if (req.session.userID === 'Player 1') opponent = users['Player 2'];
  else opponent = users['Player 1'];
  const user = users[req.session.userID];
  const templateVars = {
    user,
    number: `board${req.session.userID[7]}`,
    error: '',
    battleLog
  };
  res.render('battle_page', templateVars);

});
app.get('/db.json', (req, res) => {
  res.json({users, battleLog});
});

app.put('/battle/:node', (req, res) => {
  const player = req.session.userID;
  let user = users[player];
  const cellID = req.params.node;
  const coord = gameHelpers.convertToCoord(cellID);
  let opponent;
  if (req.session.userID === 'Player 1') opponent = 'Player 2';
  else opponent = 'Player 1';

  if (users['Player 1'].state.phase === 'battle' || users['Player 2'].state.phase === 'battle') {
    if ((battleLog.length % 2) + 1 === Number(player[7])) {
      let hit = gameHelpers.takeShot(opponent, coord);
      // let sunk = sunkShip()
      let desc = `${player} shoots at ${gameHelpers.convertToBoardNotation(cellID)}: ${hit ? 'HIT' : 'MISS'} `;
      // battleLog.push(`${player} shoots at ${gameHelpers.convertToBoardNotation(cellID)}: ${hit ? 'HIT' : 'MISS'}`);
      if (hit) {
        if (gameHelpers.sunkShip(hit, users[opponent].board)) {
          users[player].ships[hit.charCodeAt(0) - 65].sunk = true;
          desc += `\n${player} has sunk a ${gameHelpers.getShipByCode(hit, player).name}`;
          if (gameHelpers.allShipsSunk(opponent)) {
            users['Player 1'].state.phase = 'end';
            users['Player 2'].state.phase = 'end';
            desc += `${player} has won!`;
            return res.send(`${player} has won!`);
          }
        }
      }
      console.log(desc);
      battleLog.push({
        turn: battleLog.length + 1,
        boardState: {
          'Player 1': users['Player 1'].opBoard,
          'Player 2': users['Player 2'].opBoard
        },
        desc
      });
      return res.redirect('/battle');
    } else {
      res.render('battle_page', {
        error: `Waiting on ${opponent}`, user,
        number: `board${req.session.userID[7]}`,
        battleLog
      });
    }
  }
});



const getPlayerByName = name => users['Player 1'].name === name ? 'Player 1' : 'Player 2';


app.put('/', (req, res) => {
  const player = whichPlayer(users, req.ip);

  res.redirect('/');
});

app.listen(port, () => {
  console.log('listening ', port);
});