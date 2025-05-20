/**
 * Componente: Gestor de Tema (Theme Mode Handler)
 * Nivel C4: Componente dentro del contenedor Web Server (Express.js)
 * Descripción: Maneja la persistencia y recuperación del modo de visualización (oscuro o claro)
 * Tecnología: Node.js, Express.js, Sistema de archivos (fs)
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ruta al archivo que guarda el modo actual (modo claro/oscuro)
const MODE_FILE = path.join(__dirname, '../mode.txt');

// =========================================
// GET /mode/get-mode
// Funcionalidad: Leer el modo actual desde un archivo
// Retorna: 'true' (oscuro) o 'false' (claro)
// =========================================
router.get('/get-mode', (req, res) => {
  fs.readFile(MODE_FILE, 'utf8', (err, data) => {
    if (err) return res.send('false'); // Modo por defecto: claro
    res.send(data.trim());
  });
});

// =========================================
// POST /mode/set-mode
// Funcionalidad: Guardar el modo actual en un archivo
// Espera: { mode: 'true' | 'false' } en el body
// =========================================
router.post('/set-mode', express.urlencoded({ extended: false }), (req, res) => {
  const mode = req.body.mode === 'true' ? 'true' : 'false';
  fs.writeFile(MODE_FILE, mode, (err) => {
    if (err) return res.status(500).send('Error al guardar el modo');
    res.send('Guardado');
  });
});

// Exportación del router
module.exports = router;
