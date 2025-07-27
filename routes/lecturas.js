const express = require('express');
const router = express.Router();
const db = require('../db');

// Insertar lectura
router.post('/', (req, res) => {
  const { usuario_id, temperatura, ph } = req.body;
  db.query('INSERT INTO lecturas (usuario_id, temperatura, ph) VALUES (?, ?, ?)',
    [usuario_id, temperatura, ph],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar lectura' });
      res.json({ success: true });
    });
});

// Consultar lecturas del usuario
router.get('/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  db.query('SELECT * FROM lecturas WHERE usuario_id = ?', [usuario_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al obtener lecturas' });
      res.json(result);
    });
});

module.exports = router;
