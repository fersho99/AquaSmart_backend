const express = require('express');
const router = express.Router();
const db = require('../db');

// registro
router.post('/register', (req, res) => {
  const { nombre, email, contrasena } = req.body;

  db.query(
    'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
    [nombre, email, contrasena],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar' });
      }
      res.json({ usuario_id: result.insertId });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT id_U FROM usuarios WHERE email = ? AND contrasena = ?',
    [email, password],
    (err, result) => {
      if (err) {
        console.error('Error en login:', err);
        return res.status(500).json({ error: 'Error en login' });
      }
      if (result.length === 0) {
        console.log('Credenciales incorrectas');
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      res.json({ usuario_id: result[0].id_U });
    }
  );
});


module.exports = router;
