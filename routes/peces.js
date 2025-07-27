const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  db.query(`
    SELECT p.*, pu.cantidad
    FROM peces_usuario pu
    JOIN peces p ON pu.pez_id = p.id_P
    WHERE pu.usuario_id = ?
  `, [usuario_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al obtener peces' });
      res.json(result);
    });
});

module.exports = router;
