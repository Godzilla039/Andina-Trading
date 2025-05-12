const express = require('express');
const path = require('path');
const expressLay = require('express-ejs-layouts');
const axios = require('axios');
const dotenv = require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database'); 

const app = express();
const PORT = 1111;



// Configuración de EJS y layouts
app.set('view engine', 'ejs');
app.use(expressLay);
app.set('layout', 'modules/layout'); // Layout por defecto
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesión y autenticación
app.use(session({
  secret: 'clave_secreta',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Rutas
const router = require('./routes/router');
app.use(router.routes);

const modeRoutes = require('./routes/theme');
app.use('/mode', modeRoutes);

// Ruta para obtener noticias
app.get('/api/news', async (req, res) => {
  const apiKey = process.env.NEWSAPI_KEY;
  const url = `https://newsapi.org/v2/everything?q=forex&language=es&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener noticias:', error.message);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

//autenticación de google

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const name = profile.name.givenName;
  const lastname = profile.name.familyName;
  const country = profile._json.locale; // Aproximación
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (user) return done(null, user);
    db.run("INSERT INTO users (name, lastname, email, country) VALUES (?, ?, ?, ?)", [name, lastname, email, country], function(err) {
      if (err) return done(err);
      db.get("SELECT * FROM users WHERE id = ?", [this.lastID], (err, newUser) => {
        return done(null, newUser);
      });
    });
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    done(err, user);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});