const express = require("express");
const { signup, login, logout,getProfil} = require("../controllers/userController");
const router = express.Router();
const { isAuthenticated } = require("../utils/Authentication");
const { validation, validationandHandlerrors, checkLogin} = require("../utils/Validation")


router.post("/signup",validation.validateEmail,validation.validatePassword,validationandHandlerrors, signup);
router.post("/login",checkLogin,validation.validateEmail,validation.validatePassword,validationandHandlerrors, login);
router.get("/profil",isAuthenticated ,validationandHandlerrors, getProfil)
router.get("/logout", isAuthenticated ,validationandHandlerrors,  logout);


module.exports = router;
