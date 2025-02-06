const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const secretKey = process.env.SECRET_KEY;
const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
const prisma = require('../utils/client');

const generateToken = (user) => {
  const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
  return token;
};


// Function to send email with reset token
const sendMail = async (email, token) => {
  // Create a transporter using environment variables for security
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // Use environment variable for email
      pass: process.env.EMAIL_PASS, // Use environment variable for password
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Same as the auth user
    to: email,
    subject: 'Reset Password',
    text: `Your reset password token is: ${token}`,
  };

  try {
    // Send the email and wait for it to complete
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Error sending email');
  }
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
  sendMail,
  generateRefreshToken,
  verifyRefreshToken,
  refreshTokens
}
