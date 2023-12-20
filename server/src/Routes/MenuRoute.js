const express = require("express");
const MenuController = require("../controllers/menuController");

const router = express.Router();

router.get("/", MenuController.getMenuItems);

module.exports = router;
