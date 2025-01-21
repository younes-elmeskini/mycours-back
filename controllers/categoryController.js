const prisma = require("../utils/client");

const addCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = await prisma.categories.create({
        data: {
          name,
          description,
        },
      });
      res.status(201).json({ message: 'Category added successfully', data: category });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add category', error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
    const categories = await prisma.categories.findMany();
    res.status(200).json({ categories });
    } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
    }
};

const getCategoryById = async (req, res) => {
    try {
    const id = parseInt(req.params.id);
    const category = await prisma.categories.findUnique({
        where: {
        id: id,
        },
    });
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
    } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
    }
};

const updateCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const category = await prisma.categories.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ message: 'category non trouvé' });
    }
    const updates = req.body;
    await prisma.categories.update({ where: { id }, data: updates });
    const updatedCategory = await prisma.user.findUnique({ where: { id } });
    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur',error:err.message });
  }
};






module.exports = {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory
}