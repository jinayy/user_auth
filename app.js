const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRouter = require('./routes/users');
const app = express();

router = express.Router();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pwd@1234',
  database: 'Users'
});

db.connect();

app.use('/users', usersRouter);

app.get('/', (req, res) => {
   res.send('Hello world'); 
});

app.listen(5000, () => {
    console.log('listeningg');
})



module.exports = {app, db};