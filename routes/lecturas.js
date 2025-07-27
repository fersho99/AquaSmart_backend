const express = require('express');
const router = express.Router();
const db = require('../db');

// Insertar lectura
router.post('/', async (req, res) => {
  const { usuario_id, temperatura, ph } = req.body;
  try {
    await db.query(
      'INSERT INTO lecturas (usuario_id, temperatura, ph) VALUES (?, ?, ?)',
      [usuario_id, temperatura, ph]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error al guardar lectura:', err);
    res.status(500).json({ error: 'Error al guardar lectura' });
  }
});

// Consultar lecturas del usuario
router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [result] = await db.query('SELECT * FROM lecturas WHERE usuario_id = ?', [usuario_id]);
    res.json(result);
  } catch (err) {
    console.error('Error al obtener lecturas:', err);
    res.status(500).json({ error: 'Error al obtener lecturas' });
  }
});

module.exports = router;
