require('dotenv').config(); // Carga variables de entorno desde .env

const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/peces', require('./routes/peces'));
app.use('/lecturas', require('./routes/lecturas'));
app.use('/alimentacion', require('./routes/alimentacion'));

// Puerto dinámico para Render o 3000 en local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
