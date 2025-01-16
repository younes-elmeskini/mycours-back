const prisma = require("../utils/client");

const addCourse = async (req, res) => {
  const { name, duration, chapiter} = req.body;
  try {
    await prisma.course.create({
      data: {
        name,
        duration,
        chapiters: {
          create: Array.isArray(chapiter) ? chapiter : [chapiter],
        },
      },
    });
    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: "Opps!!", error });
  }
};

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
