const express = require('express')
const router = express.Router();
const messegesController = require("../controllers/messegesController");
const isAthenticated = require('../middleware/isAuthenticated');


router.get("/:chatId",isAthenticated,messegesController.getMessges);


module.exports = router;
