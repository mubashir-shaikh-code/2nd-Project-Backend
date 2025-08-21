const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // if you set a MySQL password in phpMyAdmin, put it here
  database: 'LiFlow'
});

module.exports = db;
