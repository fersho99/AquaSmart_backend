const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT p.*, pu.cantidad
      FROM peces_usuario pu
      JOIN peces p ON pu.pez_id = p.id_P
      WHERE pu.usuario_id = ?
    `, [usuario_id]);

    res.json(rows);
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error al obtener peces' });
  }
});


module.exports = router;
