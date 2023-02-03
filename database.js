const mysql = require('mysql');

let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.PASSWORD,
  database: 'Users'
});

module.exports = db;