
//Módulo de login

const login = (req, res) => {
  const registrationSuccess = req.session.registrationSuccess;
  delete req.session.registrationSuccess; // Limpiar después de mostrar
  
  res.render('login', {
      layout: 'modules/auth',
    message: req.flash('message') || '',
    messages: {
      success: req.flash('success').length > 0,
      error: req.flash('error').length > 0
  }
  });
};

const register = (req, res) => {
  res.render('register', {
      errors: [],
      data: {},
      layout: 'modules/auth'
  });
};

const terms = (req, res) => {
  res.render('terms', {
      layout: 'modules/auth'
  });
};

//módulo de dashboard

const dashboard = (req, res) => {
  res.render('home');
};

const maps = (req, res) => {
  res.render('maps');
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
  dashboard,
  tables,
  notificationsUser,
  heatMap,
  news,
  login,
  register,
  terms,
  maps
};
