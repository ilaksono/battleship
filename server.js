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
  res.redirect('/');
});

app.get('/', (req, res) => {
  if (!(users['Player 1'].name && users['Player 2'].name)) {
    if (req.session.userID === users['Player 1'].id || req.session.userID === users['Player 2'].id)
      return res.send('Please wait for other player');
    return res.redirect('/register');
  }
  // res.render('play_page', templateVars);
  res.render('home_page', templateVars);
});

app.post('/', (req, res) => {

  res.redirect('/');
});

app.get('/set', (req, res) => {
  const user = users[req.session.userID];
  const templateVars = {
    user,
    number: `board${req.session.userID[6]}`
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
        number: `board${req.session.userID[6]}`
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

          return res.redirect('/battle');
        }
        return res.redirect('/set');
      }
    }
  }

  // if(users[player].state.setDone)
});

app.get('/battle', (req, res) => {
  
});



const getPlayerByName = name => users['Player 1'].name === name ? 'Player 1' : 'Player 2';


app.put('/', (req, res) => {
  const player = whichPlayer(users, req.ip);

  res.redirect('/');
});

app.listen(port, () => {
  console.log('listening ', port);
});