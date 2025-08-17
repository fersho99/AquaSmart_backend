const express = require('express');
const router = express.Router();
const db = require('../db');

// Registro
router.post('/register', async (req, res) => {
  const { nombre, email, contrasena } = req.body;

  try {
    // --- INICIO DE LA MODIFICACIÓN ---

    // 1. Primero, buscamos si ya existe un usuario con ese email
    const [existingUser] = await db.query(
      'SELECT id_U FROM usuarios WHERE email = ?',
      [email]
    );

    // 2. Si la búsqueda encuentra un usuario, devolvemos un error
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
    }

    // 3. Si no existe, procedemos a insertarlo
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
      [nombre, email, contrasena]
    );

    // --- FIN DE LA MODIFICACIÓN ---

    res.status(201).json({ usuario_id: result.insertId }); // Se cambió a 201 Created
  } catch (err) {
    console.error('Error al registrar:', err);
    res.status(500).json({ error: 'Error al registrar' });
  }
});

// Login (sin cambios)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await db.query(
      'SELECT id_U, nombre, email FROM usuarios WHERE email = ? AND contrasena = ?',
      [email, password]
    );

    if (result.length === 0) {
      console.log('Credenciales incorrectas');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = result[0];
    res.json({
      usuario_id: usuario.id_U,
      nombre: usuario.nombre,
      email: usuario.email
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en login' });
  }
});


module.exports = router;