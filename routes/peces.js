const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  console.log('Solicitud para usuario_id:', usuario_id);

  db.query(`
    SELECT p.*, pu.cantidad
    FROM peces_usuario pu
    JOIN peces p ON pu.pez_id = p.id_P
    WHERE pu.usuario_id = ?
  `, [usuario_id], (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener peces' });
    }
    console.log('Resultado de la consulta:', result);
    res.json(result);
  });
});

module.exports = router;
