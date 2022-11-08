const path= require('path');
const express = require('express');
const router = express.Router();
const covidController = require('../controllers/covid');
const isAuth = require('../middleware/is-auth')

router.get('/covid',isAuth, covidController.getCovidStatus)

router.post('/covid/aa', covidController.postCovidStatus)
module.exports = router