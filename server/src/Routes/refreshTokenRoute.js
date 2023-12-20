const express = require("express");
const refreshTokenContoller = require("../controllers/refreshTokenController");

const router = express.Router();

router.get("/", refreshTokenContoller.handleRefreshToken);

module.exports = router;
