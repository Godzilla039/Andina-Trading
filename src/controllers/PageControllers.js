
//Módulo de login

const isAuthenticated = (req, res, next) => {
  // Permite acceso a rutas de autenticación
  if (req.path === '/login' || req.path === '/register') {
    return next();
  }
  
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.redirect('/login');
};

const login = (req, res) => {
  res.render('login', { 
    message: req.flash('error'),
    layout: 'modules/auth' 
  });
};

const register = (req, res) => {
  res.render('register', { 
    errors: [], 
    data: {},
    layout: 'modules/auth'
  });
};

//módulo de dashboard

const mainView = (req, res) => {
  res.render('home');
};

const tables = (req, res) => {
  res.render('tables');
};

const notificationsUser = (req, res) => {
  res.render('notifications');
};

const heatMap = (req, res) => {
  res.render('heatmap');
};

const news = (req, res) => {
  res.render('news');
};

module.exports = {
  mainView,
  tables,
  notificationsUser,
  heatMap,
  news,
  login,
  register
};
