const express = require("express");
const { addCategory, getCategories, getCategoryById, updateCategory } = require("../controllers/categoryController");
const router = express.Router();
const { isAuthenticated } = require("../utils/Authentication");
const { validation, validationandHandlerrors, checkLogin} = require("../utils/Validation")
const {checkRole} = require("../utils/Autorization")

router.post("/add",checkRole("admin"),addCategory)
router.get("/",checkRole("admin"),getCategories)
router.get("/:id",checkRole("admin"),getCategoryById)
router.patch("/:id",checkRole("admin"),updateCategory)