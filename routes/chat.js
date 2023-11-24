const express = require('express')
const router = express.Router();
const ChatController = require("../controllers/chatController");
const isAthenticated = require('../middleware/isAuthenticated');
const {upload} = require("../utils/multer")

router.post("/createChat",isAthenticated,upload.single('file'),ChatController.createChat);
router.post("/chatWithAgent",isAthenticated,ChatController.chat);

module.exports = router;
