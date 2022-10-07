const path = require('path');
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff');

router.get('/', staffController.getIndex)

router.get('/info', staffController.getInfo)

router.get('/Search', staffController.getSearch)

// router.get('/covid', staffController.getCovidInfo)
// router.get('/covid/:params', staffController.postCovidInfo)

router.post('/checkin', staffController.postCheckin)

router.post('/checkout', staffController.postCheckout)

router.post('/annual', staffController.postAnnual)

router.post('/changeImage', staffController.postNewImage)

module.exports = router
