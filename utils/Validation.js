const { validationResult, check } = require('express-validator');

// Middleware to handle validation errors
const validationandHandlerrors = (req, res, next) => {
    const errors = validationResult(req); // Corrected to use validationResult
    if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array()[0].msg });
    }
    next(); // Proceed to the next middleware or route handler if no errors
};

const validation ={
    validateName :[
        check('name').not().isEmpty().withMessage('Name is required')
        .isString().withMessage("name must be a string"),
    ],
    validateEmail : [
        check('email').not().isEmpty().withMessage('Email is required')
        .isEmail().withMessage("Email must be a valid email"),
    ],
    validatePassword : [
        check('password').not().isEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    ],
}


const checkLogin = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      return res.status(401).json({ message: 'Vous êtes déjà connecté' });
    }
    next();
  };

module.exports = {
    validation,
    validationandHandlerrors,
    checkLogin
};