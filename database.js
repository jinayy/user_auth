const mysql = require('mysql');

let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pwd@1234',
  database: 'Users'
});

module.exports = db;