const express = require('express')
const router = express.Router();
const examController = require("../controllers/examController");
const isAthenticated = require('../middleware/isAuthenticated');


router.post("/", isAthenticated,examController.creatExam);


router.get("/", isAthenticated, examController.getExam);

module.exports = router;
