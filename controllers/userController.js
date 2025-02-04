const prisma = require("../utils/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken,sendMail} = require("../utils/Authentication")

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
};

const getusers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        deleted: null,
      },
    });
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};
const getDeletedUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        deleted: {
          not: null,
        },
      },
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const getuserById = async (req,res) =>{
  try {
    const {id}= req.body
    const user = await prisma.user.findUnique({where: {id}});
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const updates = req.body;
    await prisma.user.update({ where: { id }, data: updates });
    const updatedUser = await prisma.user.findUnique({ where: { id } });
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur',error:err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        deleted: new Date(),
      },
    });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error:err.message });
  }
};

const signup = async (req, res) => {
    try {
        const {email, password,role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            }
        });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};


const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).send('Utilisateur non trouvé');
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (!isValidPassword) {
        return res.status(401).send('Mot de passe incorrect');
      }

      const token = generateToken(user);
      res.cookie('token', token, { secure: true, httpOnly: true });
      res.status(200).json({ message: 'Bienvenue, ' , user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
    }
};

const getProfil = async (req, res) => {
    try {

      const profil = await prisma.user.findUnique({
        where: {
          id: req.user.userId,
        },
      });
      if (!profil) {
        return res.status(404).json({ message: 'Profil non trouvé' });
      }
      res.status(200).json({ profil });
    } catch (error) {
      console.error('Error getting profil:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.userId }
      });
    if (!user) {
      return res.status(404).json({ message: 'Profil non trouvé' });
      }
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword },
      });
    res.status(200).json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur',error: error.message });
  }
  };
  
const RestPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const token = await generateToken(user.id);
    await sendMail(user.email, token);
    res.status(200).json({ message: 'Un email de réinitialisation de mot d \'accès a été envoyé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};



const logout = async (req, res) => {
    res.clearCookie('token', { secure: true, httpOnly: true });
    res.send({ message: 'Déconnexion réussie' });
};


module.exports = {
    signup,
    login,
    getProfil,
    changePassword,
    RestPassword,
    adduser,
    getusers,
    getuserById,
    logout,
    updateUser,
    deleteUser,
    getDeletedUsers
}