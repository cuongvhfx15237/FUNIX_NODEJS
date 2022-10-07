const path= require('path');
const express = require('express');
const router = express.Router();
const covidController = require('../controllers/covid');

router.get('/covid', covidController.getCovidStatus)

router.post('/covid/aa', covidController.postCovidStatus)
module.exports = router