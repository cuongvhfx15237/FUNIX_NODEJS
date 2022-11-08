const path = require('path');
const express = require('express');
const router = express.Router();
const errorController = require('../controllers/error');
const isAuth = require('../middleware/is-auth')

router.get('/500',isAuth, errorController.get500)

router.get('/404',isAuth, errorController.get404)

module.exports = router
