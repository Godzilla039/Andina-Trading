const express = require('express')
const {dashboard, tables, notificationsUser, heatMap, news, login, register,terms,maps} = require('../controllers/PageControllers')
const router = express.Router()

router.get('/', login)
router.get('/terms', terms)
router.get('/register', register)
router.get('/tables', tables)
router.get('/notifications', notificationsUser)
router.get('/heatmap', heatMap)
router.get('/news', news)
router.get('/maps', maps)
router.get('/dashboard', dashboard)

module.exports = {routes:router}