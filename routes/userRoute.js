const express = require("express");
const { signup, login, logout,getProfil,adduser,getusers,getuserById,updateUser, deleteUser,getDeletedUsers, changePassword,RestPassword} = require("../controllers/userController");
const router = express.Router();
const { isAuthenticated } = require("../utils/Authentication");
const { validation, validationandHandlerrors, checkLogin} = require("../utils/Validation")
const {checkRole} = require("../utils/Autorization")

// autentication
router.post("/signup",validation.validateEmail,validation.validatePassword,validationandHandlerrors, signup);
router.post("/login",checkLogin,validation.validateEmail,validation.validatePassword,validationandHandlerrors, login);
router.post('/reset-password', RestPassword);
router.get("/logout",validationandHandlerrors,  logout);


// users manager
router.post("/adduser", isAuthenticated, checkRole("admin"), validation.validateEmail, validation.validatePassword, validationandHandlerrors, adduser)
router.get("/", isAuthenticated, checkRole("admin"),getusers)
router.get("/deletedusers",isAuthenticated, checkRole("admin"),getDeletedUsers)
router.get("/id", isAuthenticated, checkRole("admin"),getuserById)
router.get("/profil",isAuthenticated ,validationandHandlerrors, getProfil)
router.put("/edit-Password", isAuthenticated,changePassword)
router.patch("/:id", isAuthenticated, checkRole("admin"),updateUser)
router.delete("/:id",isAuthenticated, checkRole("admin"),deleteUser)




module.exports = router;
