const express = require('express');
const router = express.Router();
const db = require('../db');

// POST 
router.post('/', async (req, res) => {
  const { usuario_id, temperatura, ph, alimento } = req.body;

  try {
    await db.query(
      'INSERT INTO lecturas (usuario_id, temperatura, ph, alimento, fecha_hora) VALUES (?, ?, ?, ?, NOW())',
      [usuario_id, temperatura, ph, alimento]
    );
    res.json({ message: 'Lectura guardada' });
  } catch (err) {
    console.error('Error al guardar lectura:', err);
    res.status(500).json({ error: 'Error al guardar lectura' });
  }
});

// GET 
router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT temperatura, ph, alimento, fecha_hora FROM lecturas WHERE usuario_id = ? ORDER BY fecha_hora DESC LIMIT 100',
      [usuario_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener lecturas:', err);
    res.status(500).json({ error: 'Error al obtener lecturas' });
  }
});

module.exports = router;
