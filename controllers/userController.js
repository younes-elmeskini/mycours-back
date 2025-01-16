const prisma = require("../utils/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/Authentication")


const adduser = async (req,res) => {
    try {
        const {email,password,role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role
                }
                });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
}

const signup = async (req, res) => {
    try {
        const {email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role
            }
        });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}


const login = async (req, res) => {
    try {
        const {email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
            }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
            }
        if (req.user) {
            return res.status(400).json({ message: 'Vous êtes déjà connecté' });
            }
        const token = generateToken(user);
        res.status(200).json({ message: 'User logged in successfully', user, token});
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out user', error });
    }
}


module.exports = {
    signup,
    login,
    logout
}