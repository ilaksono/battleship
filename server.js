const express = require('express');
const port = 8080;
const cookieSession = require('cookie-session');
const app = express();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const generateID = () => Math.random().toString(36).substring(2, 8);
app.use(cookieSession({
  name: 'session',
  keys: ['itsASecret', 'JKLUL'],
}));
app.use(bodyParser.urlencoded({ extended: true }));
const boardHelpers = require('./helpers/boardHelpers');

app.use(methodOverride('_method'));

const users = {
  "Player 1": { name: '', id: '', board: [] },
  "Player 2": { name: '', id: '', board: [] }
};

const whichPlayer = (userDB, playerID) => {
  if (userDB['Player 1'].id === playerID) return 'Player 1';
  return 'Player 2';
};
app.get('/register', (req, res) => {
  res.render('user_register');
});

app.post('register', (req, res) => {
  let username = req.body.username;
  req.session.userID = generateID();
  let player;
  if (!users['Player 1'].id) player = 'Player 1';
  else player = 'Player 2';
  users[player].id = req.session.userID;
  users[player].name = username;
  res.redirect('/');
});

app.get('/', (req, res) => {

  res.render('play_page', templateVars);
});

app.post('/', (req, res) => {

  res.redirect('/');
});

app.get('/set', (req, res) => {
  res.render('set_board');
});

app.put('/set', (req, res) => {
  
})


app.put('/', (req, res) => {
  const player = whichPlayer(users, req.ip);

  res.redirect('/');
});

app.listen(port, () => {
  console.log('listening ', port);
});