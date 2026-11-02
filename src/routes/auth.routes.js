const express = require("express");

const {
  userRegisterController,
  userLoginController,
  LogOut,
  getMe
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", userRegisterController);
router.post("/login", userLoginController);
router.post("/logout", LogOut);
router.get("/me",authMiddleware,getMe);

module.exports = router;