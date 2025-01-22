const express = require("express");
const { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory, addSubcategory, getSubcategories } = require("../controllers/categoryController");
const router = express.Router();
const { isAuthenticated } = require("../utils/Authentication");
const { validation, validationandHandlerrors, checkLogin} = require("../utils/Validation")
const {checkRole} = require("../utils/Autorization")

router.post("/add",isAuthenticated,checkRole("admin"),addCategory)
router.get("/",isAuthenticated,checkRole("admin"),getCategories)
router.get("/:id",isAuthenticated,checkRole("admin"),getCategoryById)
router.patch("/:id",isAuthenticated,checkRole("admin"),updateCategory)
router.delete("/:id",isAuthenticated,checkRole("admin"),deleteCategory)
router.post("/:id/subcategory",isAuthenticated, checkRole("admin"), addSubcategory);
router.get("/:id/subcategories",isAuthenticated, checkRole("admin"), getSubcategories); 

module.exports = router;