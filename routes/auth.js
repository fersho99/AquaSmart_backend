const express = require('express');
const router = express.Router();
const db = require('../db');

// Registro
router.post('/register', async (req, res) => {
  const { nombre, email, contrasena } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
      [nombre, email, contrasena]
    );
    res.json({ usuario_id: result.insertId });
  } catch (err) {
    console.error('Error al registrar:', err);
    res.status(500).json({ error: 'Error al registrar' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await db.query(
      'SELECT id_U FROM usuarios WHERE email = ? AND contrasena = ?',
      [email, password]
    );

    if (result.length === 0) {
      console.log('Credenciales incorrectas');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json({ usuario_id: result[0].id_U });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en login' });
  }
});

module.exports = router;
