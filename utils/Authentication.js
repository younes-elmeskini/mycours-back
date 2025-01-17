const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const generateToken = (user) => {
  const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
  return token;
};

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'] || req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Vous n\'êtes pas connecté' });
    }
    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      return res.status(401).json({ message: 'Token invalide' });
    }
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    console.log('User :', user);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Error authenticating:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers['x-access-token'] || req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Vous n\'êtes pas connecté' });
    }
    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      return res.status(401).json({ message: 'Token invalide' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = { generateToken, authenticate, verifyToken };