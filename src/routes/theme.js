const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const MODE_FILE = path.join(__dirname, '../mode.txt');

// Leer modo actual
router.get('/get-mode', (req, res) => {
  fs.readFile(MODE_FILE, 'utf8', (err, data) => {
    if (err) return res.send('false'); // Por defecto: modo claro
    res.send(data.trim());
  });
});

// Guardar nuevo modo
router.post('/set-mode', express.urlencoded({ extended: false }), (req, res) => {
  const mode = req.body.mode === 'true' ? 'true' : 'false';
  fs.writeFile(MODE_FILE, mode, (err) => {
    if (err) return res.status(500).send('Error al guardar el modo');
    res.send('Guardado');
  });
});

module.exports = router;
