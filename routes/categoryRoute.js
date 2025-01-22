const express = require("express");
const { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory, addSubcategory, getSubcategories } = require("../controllers/categoryController");
const router = express.Router();
const { isAuthenticated } = require("../utils/Authentication");
const { validation, validationandHandlerrors, checkLogin} = require("../utils/Validation")
const {checkRole} = require("../utils/Autorization")

router.post("/add",checkRole("admin"),addCategory)
router.get("/",checkRole("admin"),getCategories)
router.get("/:id",checkRole("admin"),getCategoryById)
router.patch("/:id",checkRole("admin"),updateCategory)
router.delete("/:id",checkRole("admin"),deleteCategory)
router.post("/:id/subcategory", checkRole("admin"), addSubcategory);
router.get("/:id/subcategories", checkRole("admin"), getSubcategories); 


module.exports = router;