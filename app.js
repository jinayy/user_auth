const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRouter = require('./routes/users');
const path = require('path');
const app = express();
const db = require('./database');

require('dotenv').config();

db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err);
    return;
  }
  console.log("Connection Successful !!");
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

app.use('/users', usersRouter);

app.get('/', (req, res) => {
   res.send('Hello world'); 
});

app.listen(5000, () => {
    console.log('listeningg');
})



module.exports = {app, db};