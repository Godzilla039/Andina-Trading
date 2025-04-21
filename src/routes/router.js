const express = require('express')
const {mainView, tables, notificationsUser} = require('../controllers/PageControllers')
const router = express.Router()

router.get('/', mainView)
router.get('/tables', tables)
router.get('/notifications', notificationsUser)

module.exports = {routes:router}