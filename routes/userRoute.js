const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.longinUser);
module.exports = router;
