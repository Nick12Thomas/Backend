const express = require('express')
const router = express.Router();
const examController = require("../controllers/examController");
const isAthenticated = require('../middleware/isAuthenticated');


router.post("/", isAthenticated,examController.creatExam);
router.get("/getOpenEnded/:examId", isAthenticated, examController.getOpenEnded);
router.get("/getMCQ/:examId",isAthenticated,examController.getMCQ);
router.post("/endExam",isAthenticated,examController.endExam)
router.get("/getAllExams",isAthenticated,examController.getAllExam);
router.get("/getStats/:examId",isAthenticated,examController.getStats)
module.exports = router;
