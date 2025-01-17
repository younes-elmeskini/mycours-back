const express = require("express");
const { signup, login, logout,getProfil} = require("../controllers/userController");
const router = express.Router();
const { authenticate } = require("../utils/Authentication");


router.post("/signup", signup);
router.post("/login", login);
router.get("/profil", authenticate, getProfil)
router.get("/logout", authenticate, logout);


module.exports = router;
