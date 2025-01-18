const express = require("express");
const { signup, login, logout,getProfil,adduser,getusers} = require("../controllers/userController");
const router = express.Router();
const { isAuthenticated } = require("../utils/Authentication");
const { validation, validationandHandlerrors, checkLogin} = require("../utils/Validation")
const {checkRole} = require("../utils/Autorization")


router.post("/signup",validation.validateEmail,validation.validatePassword,validationandHandlerrors, signup);
router.post("/login",checkLogin,validation.validateEmail,validation.validatePassword,validationandHandlerrors, login);
router.get("/profil",isAuthenticated ,validationandHandlerrors, getProfil)
router.get("/logout", isAuthenticated ,validationandHandlerrors,  logout);
router.post("/adduser", isAuthenticated, checkRole("admin"), validation.validateEmail, validation.validatePassword, validationandHandlerrors, adduser)
router.get("/", isAuthenticated, checkRole("admin"),getusers)

module.exports = router;
