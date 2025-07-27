const express = require('express');
const router = express.Router();
const db = require('../db');

// Insertar evento de alimentación
router.post('/', async (req, res) => {
  const { usuario_id, tipo, cantidad_g } = req.body;
  try {
    await db.query(
      'INSERT INTO alimentacion (usuario_id, tipo, cantidad_g) VALUES (?, ?, ?)',
      [usuario_id, tipo, cantidad_g]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error al guardar alimentación:', err);
    res.status(500).json({ error: 'Error al guardar alimentación' });
  }
});

// Consultar alimentación del usuario
router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [result] = await db.query('SELECT * FROM alimentacion WHERE usuario_id = ?', [usuario_id]);
    res.json(result);
  } catch (err) {
    console.error('Error al obtener alimentación:', err);
    res.status(500).json({ error: 'Error al obtener alimentación' });
  }
});

module.exports = router;
