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

const app = express();
const PORT = 1111;

// Configuración de EJS y layouts
app.set('view engine', 'ejs');
app.use(expressLay);
app.set('layout', 'modules/layout'); // Layout por defecto
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

//GETS

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.js (parte relevante)
app.use(session({
  secret: key,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambiar a true en producción con HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Rutas
const router = require('./routes/router');
app.use(router.routes);

const modeRoutes = require('./routes/theme');
app.use('/mode', modeRoutes);

//registrar usuario dentro de la base de datos

app.post('/register', async (req, res) => {
    console.log('Iniciando proceso de registro...');
    console.log('Datos recibidos:', req.body);
    
    const { name, lastname, birthdate, email, phone, country, password, confirm_password } = req.body;

    // Validaciones básicas
    if (!name || !email || !password || !confirm_password) {
        console.log('Faltan campos requeridos');
        return res.render('register', {
            message: 'Faltan campos requeridos',
            messages: { error: true },
            data: req.body
        });
    }

    if (password !== confirm_password) {
        console.log('Las contraseñas no coinciden');
        return res.render('register', {
            message: 'Las contraseñas no coinciden',
            messages: { error: true },
            data: req.body
        });
    }

    try {
        console.log('Verificando si el email existe...');
        // Verificar si el email ya existe
        db.get("SELECT email FROM users WHERE email = ?", [email], async (err, row) => {
            if (err) {
                console.error("Error al verificar email:", err);
                return res.render('register', {
                    message: 'Error al verificar el email',
                    messages: { error: true },
                    data: req.body
                });
            }

            if (row) {
                console.log('El email ya está registrado:', email);
                return res.render('register', {
                    message: 'El email ya está registrado',
                    messages: { error: true },
                    data: req.body
                });
            }

            console.log('Email disponible, generando hash de contraseña...');
            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Hash de contraseña generado');

            // Insertar nuevo usuario
            console.log('Intentando insertar nuevo usuario en la base de datos...');
            db.run(
                `INSERT INTO users (name, lastname, birthdate, email, phone, country, password)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, lastname, birthdate, email, phone, country, hashedPassword],
                function (err) {
                    if (err) {
                        console.error("Error al registrar usuario:", err);
                        return res.render('register', {
                            message: 'Error al registrar el usuario',
                            messages: { error: true },
                            data: req.body
                        });
                    }

                    console.log('Usuario registrado exitosamente. ID:', this.lastID);
                    // Redireccionar a login con mensaje de éxito
                    return res.redirect('/?registrationSuccess=¡Cuenta creada exitosamente! Por favor inicia sesión.');
                }
            );
        });
    } catch (error) {
        console.error("Error en el proceso de registro:", error);
        return res.render('register', {
            message: 'Error en el servidor',
            messages: { error: true },
            data: req.body
        });
    }
});

//revisar la existencia de la cuenta y redirigir al dashboard

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Por favor ingresa correo y contraseña' });
  }

  const db = new sqlite3.Database('./users.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Error abriendo la base de datos:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor (BD)' });
    }

    db.get("SELECT id, password FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        console.error("Error buscando usuario:", err);
        db.close();
        return res.status(500).json({ success: false, message: 'Error consultando usuario' });
      }

      if (!user) {
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
            console.error("Error guardando sesión:", err);
            return res.status(500).json({ success: false, message: 'Error con la sesión' });
          }

          return res.json({ success: true });
        });

      } catch (error) {
        db.close();
        console.error("Error comparando contraseñas:", error);
        return res.status(500).json({ success: false, message: 'Error al verificar credenciales' });
      }
    });
  });
});

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

app.get('/', (req, res) => {
    const registrationMessage = req.query.registrationSuccess;

    res.render('login', {
        message: registrationMessage || '',
        messages: registrationMessage ? { success: true } : null
    });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});