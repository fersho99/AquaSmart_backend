const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /horarios
router.post('/', async (req, res) => {
  const { usuario_id, hora1, hora2 } = req.body;

  try {
    // Elimina horarios anteriores (si se desea solo guardar dos por usuario)
    await db.query('DELETE FROM horarios WHERE usuario_id = ?', [usuario_id]);

    await db.query(
      'INSERT INTO horarios (usuario_id, hora) VALUES (?, ?), (?, ?)',
      [usuario_id, hora1, usuario_id, hora2]
    );

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
      'SELECT hora FROM horarios WHERE usuario_id = ? ORDER BY hora ASC',
      [usuario_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener horarios:', err);
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
});

module.exports = router; 
