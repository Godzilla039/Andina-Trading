/**
 * Componente: Servidor Principal - app.js
 * Nivel C4: Container (Contenedor Web)
 * Descripción: Este archivo representa el punto de entrada principal de la aplicación web.
 * Se encarga de configurar el motor de vistas, middlewares, rutas, conexión a la base de datos
 * y controladores para el proceso de autenticación y otras funcionalidades.
 * Tecnología: Node.js con Express.js
 */

const express = require('express');
const path = require('path');
const expressLay = require('express-ejs-layouts');
const axios = require('axios');
const dotenv = require('dotenv').config();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database'); 
const key = require('crypto').randomBytes(64).toString('hex');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Inicialización del servidor Express
const app = express();
const PORT = 1111;

/**
 * Configuración del motor de vistas (EJS)
 * Configuración de layout base y rutas de vistas
 */
app.set('view engine', 'ejs');
app.use(expressLay);
app.set('layout', 'modules/layout');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

/**
 * Rutas externas (API externa: Exchange Rates)
 * Nivel C4: Component dentro del contenedor Web
 */

// Obtener lista de símbolos disponibles
app.get('/symbols', async (req, res) => {
  try {
    const response = await fetch("https://api.apilayer.com/exchangerates_data/symbols", {
      method: 'GET',
      headers: { "apikey": process.env.EXCHANGE },
      redirect: 'follow'
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error al obtener los símbolos:', error);
    res.status(500).json({ error: 'Error al obtener los símbolos' });
  }
});

// Conversión entre monedas
app.get('/convert', async (req, res) => {
  const { to, from, amount } = req.query;

  if (!to || !from || !amount) {
    return res.status(400).json({ error: "Parámetros 'to', 'from' y 'amount' son requeridos" });
  }

  try {
    const response = await fetch(
      `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
      {
        method: 'GET',
        headers: { "apikey": process.env.EXCHANGE },
        redirect: 'follow'
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error al convertir monedas:', error);
    res.status(500).json({ error: 'Error al convertir monedas' });
  }
});

/**
 * Middlewares esenciales para parsing, sesiones y mensajes flash
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: key,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ⚠️ Cambiar a true en producción
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
 * Importación y uso de rutas locales
 */
const router = require('./routes/router');
app.use(router.routes);

const modeRoutes = require('./routes/theme');
app.use('/mode', modeRoutes);

/**
 * Registro de usuario
 * Funcionalidad: Verifica duplicados, encripta contraseña y registra el usuario
 */
app.post('/register', async (req, res) => {
  const { name, lastname, birthdate, email, phone, country, password, confirm_password } = req.body;

  if (!name || !email || !password || !confirm_password) {
    return res.render('register', {
      message: 'Faltan campos requeridos',
      messages: { error: true },
      data: req.body
    });
  }

  if (password !== confirm_password) {
    return res.render('register', {
      message: 'Las contraseñas no coinciden',
      messages: { error: true },
      data: req.body
    });
  }

  try {
    db.get("SELECT email FROM users WHERE email = ?", [email], async (err, row) => {
      if (err) {
        return res.render('register', {
          message: 'Error al verificar el email',
          messages: { error: true },
          data: req.body
        });
      }

      if (row) {
        return res.render('register', {
          message: 'El email ya está registrado',
          messages: { error: true },
          data: req.body
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        `INSERT INTO users (name, lastname, birthdate, email, phone, country, password)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, lastname, birthdate, email, phone, country, hashedPassword],
        function (err) {
          if (err) {
            return res.render('register', {
              message: 'Error al registrar el usuario',
              messages: { error: true },
              data: req.body
            });
          }

          return res.redirect('/?registrationSuccess=¡Cuenta creada exitosamente! Por favor inicia sesión.');
        }
      );
    });
  } catch (error) {
    return res.render('register', {
      message: 'Error en el servidor',
      messages: { error: true },
      data: req.body
    });
  }
});

/**
 * Inicio de sesión
 * Funcionalidad: Verifica credenciales y crea sesión si son válidas
 */
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Por favor ingresa correo y contraseña' });
  }

  const db = new sqlite3.Database('./users.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error en el servidor (BD)' });
    }

    db.get("SELECT id, password FROM users WHERE email = ?", [email], async (err, user) => {
      if (err || !user) {
        db.close();
        return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
      }

      try {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          db.close();
          return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }

        if (!req.session) {
          db.close();
          return res.status(500).json({ success: false, message: 'Error con la sesión' });
        }

        req.session.userId = user.id;
        req.session.save(err => {
          db.close();
          if (err) {
            return res.status(500).json({ success: false, message: 'Error con la sesión' });
          }

          return res.json({ success: true });
        });

      } catch (error) {
        db.close();
        return res.status(500).json({ success: false, message: 'Error al verificar credenciales' });
      }
    });
  });
});

/**
 * Noticias desde NewsAPI
 * Retorna las últimas noticias relacionadas con Forex en español
 */
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

/**
 * Ruta principal: Login
 * Muestra mensaje de éxito si el usuario fue registrado
 */
app.get('/', (req, res) => {
  const registrationMessage = req.query.registrationSuccess;

  res.render('login', {
    message: registrationMessage || '',
    messages: registrationMessage ? { success: true } : null
  });
});

/**
 * Inicia el servidor
 */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
