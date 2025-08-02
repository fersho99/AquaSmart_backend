const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /horarios
router.post('/', async (req, res) => {
  const { usuario_id, hora1, hora2 } = req.body;

  try {
    // Verifica si el usuario ya tiene horario
    const [existing] = await db.query('SELECT * FROM horario WHERE usuario_id = ?', [usuario_id]);

    if (existing.length > 0) {
      // Si ya existe, actualiza
      await db.query(
        'UPDATE horario SET hora1 = ?, hora2 = ? WHERE usuario_id = ?',
        [hora1, hora2, usuario_id]
      );
    } else {
      // Si no existe, inserta nuevo
      await db.query(
        'INSERT INTO horario (usuario_id, hora1, hora2) VALUES (?, ?, ?)',
        [usuario_id, hora1, hora2]
      );
    }

    res.json({ message: 'Horarios guardados correctamente' });
  } catch (err) {
    console.error('Error al guardar horarios:', err);
    res.status(500).json({ error: 'Error al guardar horarios' });
  }
});

// GET /horarios/:usuario_id
router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT hora1, hora2 FROM horario WHERE usuario_id = ?',
      [usuario_id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({ hora1: null, hora2: null });
    }
  } catch (err) {
    console.error('Error al obtener horarios:', err);
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
});

module.exports = router;
