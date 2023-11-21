const express = require('express')
const router = express.Router();
const questionController = require("../controllers/questionsController");
const isAthenticated = require('../middleware/isAuthenticated');


router.post("/checkAnswer", isAthenticated,questionController.checkQuestion);



module.exports = router;
