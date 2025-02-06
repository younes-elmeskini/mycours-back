const prisma = require("../utils/client");

const addCourse = async (req, res) => {
    try {
        const { title, description, image, price, subcategoryid } = req.body;
        const course = await prisma.course.create({
            data: {
                title,
                description,
                image,
                price,
                userId : req.user.userId,
                subcategoryid,
            }
        })
        res.status(201).json({ message: "Course added successfully", course });        
    } catch (error) {
        res.status(500).json({ message: "Failed to add course", error });
    }
}

const getAllcoures = async (req, res) => {
    try {
        const courses = await prisma.course.findMany();
        if(!courses){
            return res.status(404).json({ message: "No courses found" });
        }
        res.status(200).json({ message: "Courses retrieved successfully", courses });
    } catch (error) {
        res.status(500).json({message:" Failed to retrieve courses",error});
    }
}

const getCourseById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const course = await prisma.course.findUnique({
            where: {
                id: id,
            },
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course retrieved successfully", course });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve course", error });
    }
}

module.exports = {
    addCourse,
    getAllcoures,
    getCourseById
}
