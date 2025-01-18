const express = require("express");
const { signup, login, logout,getProfil} = require("../controllers/userController");
const router = express.Router();
const { isAuthenticated } = require("../utils/Authentication");
const { validation, validationandHandlerrors} = require("../utils/Validation")


router.post("/signup", signup);
router.post("/login",validation.validateEmail,validation.validatePassword,validationandHandlerrors, login);
router.get("/profil",isAuthenticated, getProfil)
router.get("/logout", isAuthenticated,  logout);


module.exports = router;
