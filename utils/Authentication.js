const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
const prisma = require('../utils/client');

const generateToken = (user) => {
  const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
  return token;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ userId: user.id, role: user.role }, refreshTokenSecretKey, { expiresIn: '7d' });
  return refreshToken;
};

const verifyToken = (token, res) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { decoded, token };
  } catch (error) {
    return { error: 'Invalid or expired token' };
  }
};

const verifyRefreshToken = (refreshToken, res) => {
  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecretKey);
    return { decoded, refreshToken };
  } catch (error) {
    return { error: 'Invalid or expired refresh token' };
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

const refreshTokens = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token invalide ou absent' });
  }

  const result = verifyRefreshToken(refreshToken, res);
  if (result.error) {
    return res.status(401).json(result);
  }

  const user = await prisma.user.findUnique({ where: { id: result.decoded.userId } });
  if (!user) {
    return res.status(404).json({ error: 'User  not found' });
  }

  const newToken = generateToken(user);
  const newRefreshToken = generateRefreshToken(user);

  res.cookie('token', newToken, { secure: true, httpOnly: true });
  res.cookie('refreshToken', newRefreshToken, { secure: true, httpOnly: true });

  res.status(200).json({ message: 'Tokens refreshed successfully' });
};

module.exports ={
  generateToken,
  verifyToken,
  isAuthenticated,
  generateRefreshToken,
  verifyRefreshToken,
  refreshTokens
}
