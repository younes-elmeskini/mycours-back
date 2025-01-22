//Configuring Dotenv to use environment variables from .env file
require("dotenv").config();

//Creating express server
const express = require("express");
const app = express();

// Specifying the port
const port = process.env.PORT || 5000;

//Using Express.JSON
app.use(express.json());

// CORS Handler
const cors = require("cors");
app.use(cors());

// Disabling the X-Powered-By header
app.disable("x-powered-by");

// use helmet
const helmet = require("helmet");
app.use(helmet());

//
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});

app.use(limiter);

// routes

// app.use("/course", require("./routes/courseRoute"));

app.use("/category", require("./routes/categoryRoute"));

app.use("/user", require("./routes/userRoute"));

//Listening om the port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});