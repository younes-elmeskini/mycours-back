const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const prisma = require('../utils/client');

const generateToken = (user) => {
  const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
  return token;
};
