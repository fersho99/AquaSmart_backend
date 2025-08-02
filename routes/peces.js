// routes/peces.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Guardar pez y registrar en peces_usuario
router.post('/guardar', async (req, res) => {
  const { usuario_id, nombre, temp_min, temp_max, ph_min, ph_max, descripcion } = req.body;

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
      'INSERT INTO peces_usuario (usuario_id, pez_id, cantidad) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE cantidad = cantidad + 1',
      [usuario_id, pez_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error al guardar el pez:', err);
    res.status(500).json({ error: 'Error al guardar el pez' });
  }
});

module.exports = router;
