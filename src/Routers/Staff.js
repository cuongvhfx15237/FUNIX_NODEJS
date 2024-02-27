const path = require("path");
const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff");
const isAuth = require("../middleware/is-auth");

router.get("/", isAuth, staffController.getIndex);

router.get("/info", isAuth, staffController.getInfo);

router.get("/Search", isAuth, staffController.getSearch);

// router.get("/Search2", isAuth, staffController.getSearch2);

// router.get('/covid', staffController.getCovidInfo)
// router.get('/covid/:params', staffController.postCovidInfo)

router.post("/checkIn", staffController.postCheckIn);

router.post("/checkOut", staffController.postCheckOut);

router.post("/annual", staffController.postAnnual);

router.post("/changeImage", staffController.postNewImage);

module.exports = router;
