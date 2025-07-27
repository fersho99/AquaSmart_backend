const express = require('express');
const router = express.Router();
const db = require('../db');

// Insertar evento de alimentación
router.post('/', (req, res) => {
  const { usuario_id, tipo, cantidad_g } = req.body;
  db.query('INSERT INTO alimentacion (usuario_id, tipo, cantidad_g) VALUES (?, ?, ?)',
    [usuario_id, tipo, cantidad_g],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar alimentación' });
      res.json({ success: true });
    });
});

// Consultar alimentación del usuario
router.get('/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  db.query('SELECT * FROM alimentacion WHERE usuario_id = ?', [usuario_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al obtener alimentación' });
      res.json(result);
    });
});

module.exports = router;
