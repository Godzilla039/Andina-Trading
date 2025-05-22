/**
 * Componente: Enrutador de páginas (Page Router)
 * Nivel C4: Componente dentro del contenedor Web Server (Express.js)
 * Descripción: Encapsula las rutas asociadas a páginas de autenticación y dashboard
 * Tecnología: Node.js, Express.js
 */

const express = require('express');
const router = express.Router();

// Importación de controladores de páginas
const {
  dashboard,
  tables,
  notificationsUser,
  heatMap,
  news,
  login,
  register,
  terms,
  maps,
  calc,
  trade
} = require('../controllers/PageControllers');

// =========================
// Rutas públicas (auth/landing)
// =========================

router.get('/', login);                 // Página principal de login
router.get('/terms', terms);           // Términos y condiciones
router.get('/register', register);     // Registro de nuevos usuarios

// =========================
// Rutas del Dashboard (privadas)
// =========================

router.get('/dashboard', dashboard);           // Dashboard principal
router.get('/tables', tables);                 // Tablas de datos
router.get('/notifications', notificationsUser); // Notificaciones del usuario
router.get('/heatmap', heatMap);               // Mapa de calor
router.get('/news', news);                     // Noticias
router.get('/maps', maps);                     // Mapa geográfico
router.get('/calculator', calc);               // Calculadora
router.get('/trade', trade);                   // Calculadora

// =========================
// Exportación del router
// =========================

module.exports = { routes: router };
