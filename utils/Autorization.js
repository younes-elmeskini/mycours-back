const prisma = require('../utils/client');
// Middleware pour vérifier le rôle
const checkRole = (role) => {
  return (req, res, next) => {
    const userRole =  req.user.role;
    if (!userRole || userRole !== role) {
      return res.status(403).json({ message: 'Vous n\'avez pas les autorisations nécessaires' });
    }
    next();
  };
};

module.exports ={
    checkRole
}