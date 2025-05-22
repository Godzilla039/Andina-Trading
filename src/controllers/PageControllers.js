/**
 * Componente: Controlador de Páginas (PageControllers.js)
 * Nivel C4: Component dentro del Contenedor Web (Express.js)
 * Descripción: Maneja la renderización de vistas para módulos de autenticación y dashboard.
 * Tecnología: Node.js con Express.js
 */

// =======================
// Módulo de Autenticación
// =======================

/**
 * Renderiza la vista de login
 * Muestra mensajes flash de éxito o error después del registro o intento fallido de login
 */
const login = (req, res) => {
  const registrationSuccess = req.session.registrationSuccess;
  delete req.session.registrationSuccess; // Limpia el mensaje después de mostrarlo

  res.render('login', {
    layout: 'modules/auth',
    message: req.flash('message') || '',
    messages: {
      success: req.flash('success').length > 0,
      error: req.flash('error').length > 0
    }
  });
};

/**
 * Renderiza la vista de registro
 * Inicializa sin errores ni datos previos
 */
const register = (req, res) => {
  res.render('register', {
    errors: [],
    data: {},
    layout: 'modules/auth'
  });
};

/**
 * Renderiza la vista de términos y condiciones
 */
const terms = (req, res) => {
  res.render('terms', {
    layout: 'modules/auth'
  });
};

// ===================
// Módulo de Dashboard
// ===================

/**
 * Renderiza el dashboard principal
 */
const dashboard = (req, res) => {
  res.render('home');
};

/**
 * Renderiza la vista de mapas (geográficos o de calor)
 */
const maps = (req, res) => {
  res.render('maps');
};

/**
 * Renderiza la vista de tablas de datos
 */
const tables = (req, res) => {
  res.render('tables');
};

/**
 * Renderiza la vista de notificaciones para el usuario
 */
const notificationsUser = (req, res) => {
  res.render('notifications');
};

/**
 * Renderiza el mapa de calor (heatmap)
 */
const heatMap = (req, res) => {
  res.render('heatmap');
};

/**
 * Renderiza la vista de noticias
 */
const news = (req, res) => {
  res.render('news');
};

/**
 * Renderiza la calculadora de divisas o herramientas similares
 */
const calc = (req, res) => {
  res.render('calculator');
};

/**
 * Renderiza el sistema de compra/venta de acciones
 */
const trade = (req, res) => {
  res.render('trade');
};


// ======================
// Exportación del módulo
// ======================

module.exports = {
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
};
