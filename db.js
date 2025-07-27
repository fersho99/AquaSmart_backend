const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

module.exports = pool.promise();
