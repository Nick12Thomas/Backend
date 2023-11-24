const express = require('express')
const router = express.Router();
const messegesController = require("../controllers/messegesController");
const isAthenticated = require('../middleware/isAuthenticated');


router.get("/",isAthenticated,messegesController.getMessges);


module.exports = router;
