const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/signup", AuthController.handleNewUser);
router.post("/signin", AuthController.handleLogin);
router.post("/signout", AuthController.handleLogout);

module.exports = router;
