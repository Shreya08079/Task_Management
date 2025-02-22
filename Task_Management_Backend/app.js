require("dotenv").config();
require("./config/dbConfig");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 1814;

// Middlewares
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/users", authRoutes);
app.use("/otps", otpRoutes);
app.use("/tasks", taskRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
