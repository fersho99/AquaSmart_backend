const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '82.197.82.75',
  user: 'u122778614_AquaSmart',
  password: 'sBV5;s;!H7z', 
  database: 'u122778614_AquaSmart'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

module.exports = db;
