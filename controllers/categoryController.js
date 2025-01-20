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



  
module.exports = {
    addCategory,
}