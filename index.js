const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/peces', require('./routes/peces'));
app.use('/lecturas', require('./routes/lecturas'));
app.use('/alimentacion', require('./routes/alimentacion'));

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
