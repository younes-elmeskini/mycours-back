const express = require("express");
const { signup, login, logout,getProfil} = require("../controllers/userController");
const router = express.Router();
const { authenticate } = require("../utils/Authentication");


router.post("/signup", signup);
router.post("/login", login);
router.get("/profil", getProfil)
router.get("/logout",  logout);


module.exports = router;
