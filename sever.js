const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
res.render('play_page', templateVars);
});

app.post('/', (req, res) => {

});
app.put;


app.listen(port, () => {
    console.log('listening ', port);
});