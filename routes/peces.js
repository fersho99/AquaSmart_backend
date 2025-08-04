// routes/peces.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Guardar pez y registrar en peces_usuario
router.post('/guardar', async (req, res) => {
  const { usuario_id, nombre, temp_min, temp_max, ph_min, ph_max, descripcion, cantidad } = req.body;

  try {
    // Verificar si ya existe el pez en la tabla peces
    const [existentePez] = await db.query('SELECT id_P FROM peces WHERE nombre = ?', [nombre]);
    let pez_id;

    if (existentePez.length > 0) {
      pez_id = existentePez[0].id_P;
    } else {
      const [insertado] = await db.query(
        'INSERT INTO peces (nombre, temp_min, temp_max, ph_min, ph_max, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, temp_min, temp_max, ph_min, ph_max, descripcion]
      );
      pez_id = insertado.insertId;
    }

    // Verificar si el usuario ya tiene ese pez
    const [existenteUsuario] = await db.query(
      'SELECT cantidad FROM peces_usuario WHERE usuario_id = ? AND pez_id = ?',
      [usuario_id, pez_id]
    );

    if (existenteUsuario.length > 0) {
      // Si ya existe, sumamos la cantidad
      await db.query(
        'UPDATE peces_usuario SET cantidad = cantidad + ? WHERE usuario_id = ? AND pez_id = ?',
        [cantidad || 1, usuario_id, pez_id]
      );
    } else {
      // Si no existe, lo insertamos
      await db.query(
        'INSERT INTO peces_usuario (usuario_id, pez_id, cantidad) VALUES (?, ?, ?)',
        [usuario_id, pez_id, cantidad || 1]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error al guardar el pez:', err);
    res.status(500).json({ error: 'Error al guardar el pez' });
  }
});

// Obtener peces agrupados por especie
router.get('/usuario/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_P AS pez_id,
        p.nombre,
        CAST(SUM(pu.cantidad) AS UNSIGNED) AS cantidad,
        p.temp_min,
        p.temp_max,
        p.ph_min,
        p.ph_max,
        p.descripcion
      FROM peces_usuario pu
      JOIN peces p ON pu.pez_id = p.id_P
      WHERE pu.usuario_id = ?
      GROUP BY p.id_P, p.nombre, p.temp_min, p.temp_max, p.ph_min, p.ph_max, p.descripcion
    `, [usuario_id]);

    res.json(rows);
  } catch (err) {
    console.error('Error al obtener los peces del usuario:', err);
    res.status(500).json({ error: 'Error al obtener los peces del usuario' });
  }
});

// Eliminar pez o reducir cantidad
router.post('/eliminar', async (req, res) => {
  const { usuario_id, pez_id, cantidad } = req.body;

  try {
    const [existente] = await db.query(
      'SELECT cantidad FROM peces_usuario WHERE usuario_id = ? AND pez_id = ?',
      [usuario_id, pez_id]
    );

    if (existente.length === 0) {
      return res.status(404).json({ error: 'Este pez no está en tu pecera' });
    }

    const cantidadActual = existente[0].cantidad;

    if (!cantidad || cantidad >= cantidadActual) {
      // Eliminar el pez si no se especifica cantidad o si la cantidad a quitar >= actual
      await db.query(
        'DELETE FROM peces_usuario WHERE usuario_id = ? AND pez_id = ?',
        [usuario_id, pez_id]
      );
    } else {
      // Restar solo la cantidad indicada
      await db.query(
        'UPDATE peces_usuario SET cantidad = cantidad - ? WHERE usuario_id = ? AND pez_id = ?',
        [cantidad, usuario_id, pez_id]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error al eliminar el pez:', err);
    res.status(500).json({ error: 'Error al eliminar el pez' });
  }
});

module.exports = router;
