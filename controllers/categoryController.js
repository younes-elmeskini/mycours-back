const prisma = require('@prisma/client')

const addCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = await prisma.category.create({
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
      const categories = await prisma.category.findMany();
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories' });
    }
  };




module.exports = {
    addCategory,
    getCategories
}