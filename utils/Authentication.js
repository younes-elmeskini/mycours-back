const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const generateToken = (user) => {
  const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { generateToken, verifyToken };