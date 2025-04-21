const express = require('express')
const path = require('path')
const expressLay = require('express-ejs-layouts')

const app = express()

app.set('view engine', 'ejs')
app.use(expressLay)
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Se hace uso de router

const router = require('./routes/router')
app.use(router.routes)

//end

/* get de prueba de funcionamiento
app.get('/',(req,res)=>{
    res.send('Módulo de dashboard para Andina Trading')
}) */

const PORT = 1111
app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})