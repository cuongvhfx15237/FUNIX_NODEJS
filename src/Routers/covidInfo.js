const path= require('path');
const express = require('express');
const router = express.Router();
const covidController = require('../controllers/covid');
const isAuth = require('../middleware/is-auth')

router.get('/',isAuth, covidController.getCovidStatus)

router.post('/submit', covidController.postCovidStatus)

module.exports = router