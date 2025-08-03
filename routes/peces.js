// routes/peces.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Guardar pez y registrar en peces_usuario
router.post('/guardar', async (req, res) => {
  const { usuario_id, nombre, temp_min, temp_max, ph_min, ph_max, descripcion, cantidad } = req.body;

  try {
    // Verificar si ya existe el pez
    const [existente] = await db.query('SELECT id_P FROM peces WHERE nombre = ?', [nombre]);

    let pez_id;

    if (existente.length > 0) {
      pez_id = existente[0].id_P;
    } else {
      const [insertado] = await db.query(
        'INSERT INTO peces (nombre, temp_min, temp_max, ph_min, ph_max, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, temp_min, temp_max, ph_min, ph_max, descripcion]
      );
      pez_id = insertado.insertId;
    }

    // Registrar en peces_usuario
    await db.query(
      `INSERT INTO peces_usuario (usuario_id, pez_id, cantidad)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)`,
      [usuario_id, pez_id, cantidad || 1]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error al guardar el pez:', err);
    res.status(500).json({ error: 'Error al guardar el pez' });
  }
});

// GET /peces/usuario/:usuario_id
router.get('/usuario/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT p.nombre, pu.cantidad, p.temp_min, p.temp_max, p.ph_min, p.ph_max, p.descripcion
      FROM peces_usuario pu
      JOIN peces p ON pu.pez_id = p.id_P
      WHERE pu.usuario_id = ?
    `, [usuario_id]);

    res.json(rows);
  } catch (err) {
    console.error('Error al obtener los peces del usuario:', err);
    res.status(500).json({ error: 'Error al obtener los peces del usuario' });
  }
});


module.exports = router;
