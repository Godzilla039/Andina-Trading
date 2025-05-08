const express = require('express')
const path = require('path')
const expressLay = require('express-ejs-layouts')
const axios = require('axios');
const dotenv = require('dotenv').config();

const app = express()
const PORT = 1111

app.set('view engine', 'ejs')
app.use(expressLay)
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));

//Se hace uso de router

const router = require('./routes/router')
app.use(router.routes)

const modeRoutes = require('./routes/theme');
app.use('/mode', modeRoutes);

//end

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

app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})