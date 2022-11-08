const path = require('path');
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff');
const isAuth = require('../middleware/is-auth')

router.get('/',isAuth, staffController.getIndex)

router.get('/info',isAuth, staffController.getInfo)

router.get('/Search',isAuth, staffController.getSearch)

// router.get('/covid', staffController.getCovidInfo)
// router.get('/covid/:params', staffController.postCovidInfo)

router.post('/checkin',isAuth , staffController.postCheckin)

router.post('/checkout',isAuth , staffController.postCheckout)

router.post('/annual',isAuth , staffController.postAnnual)

router.post('/changeImage',isAuth , staffController.postNewImage)

module.exports = router
