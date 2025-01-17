const prisma = require("../utils/client");

const addCourse = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        image,
        },
        });
        res.status(201).json({ message: "Course added successfully", data: course });
  } catch (error) {
    res.status(500).send({ message: "Failed to add course", error: error.message });
  }
  
}

const getCourses = async (req, res) => {
  try {
    const data = await prisma.course.findMany({
      include: {
        lessons: true,
      },
    });
    res.status(200).send({ message: "success", data });
  } catch (error) {
    res.status(500).send({ message: "Opps!!" });
  }
};

module.exports = { addCourse, getCourses };

// {
//   "name": "Advanced MongoDB",
//   "duration": 15,
//   "lesson": [
//     {
//       "name": "Lesson 1: Aggregation Framework",
//       "description": "Learn the basics of aggregation pipelines in MongoDB"
//     },
//     {
//       "name": "Lesson 2: Indexing Strategies",
//       "description": "Optimize query performance using MongoDB indexes"
//     }
//   ]
// }
