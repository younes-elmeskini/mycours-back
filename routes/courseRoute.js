const express = require("express");
const { addCourse, getAllcoures, getCourseById } = require("../controllers/courseController");
const router = express.Router();
const { isAuthenticated } = require("../utils/Authentication");
const { validation, validationandHandlerrors, checkLogin} = require("../utils/Validation")
const {checkRole} = require("../utils/Autorization")

router.post("/add",validationandHandlerrors, addCourse)
router.get("/",isAuthenticated,validationandHandlerrors, getAllcoures)
router.get("/:id",isAuthenticated,validationandHandlerrors, getCourseById)


module.exports = router;
