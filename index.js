require('dotenv').config(); // Carga variables de entorno desde .env

const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz para probar que el servidor está vivo
app.get('/', (req, res) => {
  res.send('¡Backend AquaSmart funcionando!');
});

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/peces', require('./routes/peces'));
app.use('/lecturas', require('./routes/lecturas'));
app.use('/alimentacion', require('./routes/alimentacion'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
