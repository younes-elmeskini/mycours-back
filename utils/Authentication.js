const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const prisma = require('../utils/client');

const generateToken = (user) => {
  const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
  return token;
};

const verifyToken = (token, res) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { decoded, token };
  } catch (error) {
    return { error: 'Invalid or expired token' };
  }
};

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Token invalide ou absent' });
  }

  const result = verifyToken(token, res);
  if (result.error) {
    return res.status(401).json(result);
  }

  req.user = result.decoded;
  next();
};

module.exports ={
  generateToken,
  verifyToken,
  isAuthenticated
}
