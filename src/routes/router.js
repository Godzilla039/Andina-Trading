const express = require('express')
const {mainView, tables, notificationsUser, heatMap, news, login, register} = require('../controllers/PageControllers')
const router = express.Router()

router.get('/', mainView)
router.get('/tables', tables)
router.get('/notifications', notificationsUser)
router.get('/heatmap', heatMap)
router.get('/news', news)
router.get('/login', login)
router.get('/register', register)

module.exports = {routes:router}