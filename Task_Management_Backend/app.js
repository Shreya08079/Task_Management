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

app.use(morgan("dev"));
app.use(cors({ origin: "https://shreya-task-management.netlify.app", credentials: true }));
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true
//   }));
app.use(express.json());
app.use(cookieParser());

app.use("/users", authRoutes);
app.use("/otps", otpRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
