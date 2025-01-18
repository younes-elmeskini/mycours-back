const express = require("express");
const { signup, login, logout,getProfil} = require("../controllers/userController");
const router = express.Router();
const { isAuthenticated } = require("../utils/Authentication");


router.post("/signup", signup);
router.post("/login", login);
router.get("/profil",isAuthenticated, getProfil)
router.get("/logout", isAuthenticated,  logout);


module.exports = router;
