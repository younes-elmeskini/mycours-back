const express = require("express");
const { addCategory, getCategories } = require("../controllers/categoryController");
const router = express.Router();
const { isAuthenticated } = require("../utils/Authentication");
const { validation, validationandHandlerrors, checkLogin} = require("../utils/Validation")
const {checkRole} = require("../utils/Autorization")

router.post("/add",checkRole("admin"),addCategory)
router.get("/",chechRole("admin"),getCategories)