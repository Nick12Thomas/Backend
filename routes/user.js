const express = require('express')
const router = express.Router();
const UserController = require("../controllers/userController");
const isAthenticated = require('../middleware/isAuthenticated');


router.post("/signup", UserController.signup);


router.post("/signin", UserController.signin);

router.get("/getUserInfo",isAthenticated ,UserController.getUserInfo);

module.exports = router;
