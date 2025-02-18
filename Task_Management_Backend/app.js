require("dotenv").config();  // Load environment variables
require("./config/dbConfig.js");  // Database connection
const PORT = process.env.PORT || 1814;
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const User = require("./models/userModel.js");
const { generateOTP } = require("./utils/otpHelper.js");
const OTP = require("./models/otpModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Task = require("./models/taskModel.js");
const nodemailer = require("nodemailer");  // Import Nodemailer

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser());  // For handling cookies

// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail for sending emails
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASS,  // Your email app password
  },
});

// Function to send OTP email using Nodemailer
const sendOtpEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;  // Email sent successfully
  } catch (error) {
    console.error('Error sending email:', error);
    return false;  // Failed to send email
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Server is working fine ...</h1>");
});

// Send OTP
app.post("/otps", async (req, res) => {
  const { email } = req.body;

  // Check for email in request body
  if (!email) {
    return res.status(400).json({
      status: "fail",
      message: 'Missing required param: "email"',
    });
  }

  // Generate OTP
  const otp = generateOTP();

  // Send OTP email
  const isEmailSent = await sendOtpEmail(email, otp);

  if (!isEmailSent) {
    return res.status(500).json({
      status: "fail",
      message: "Email could not be sent! Please try again after 30 seconds!",
    });
  }

  // Hash OTP and store it in the database
  const newSalt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp.toString(), newSalt);

  await OTP.create({
    email,
    otp: hashedOtp,
  });

  return res.status(201).json({
    status: "success",
    message: `OTP sent to ${email}`,
  });
});

// Register user
app.post("/users/register", async (req, res) => {
  try {
    const { email, password, otp, fullName } = req.body;

    // Verify the OTP
    const otpDoc = await OTP.findOne({ email }).sort("-createdAt");

    if (!otpDoc) {
      return res.status(400).json({
        status: "fail",
        msg: "Otp is not sent or is expired.",
      });
    }

    const { otp: hashedOtp } = otpDoc;
    const isOtpCorrect = await bcrypt.compare(otp.toString(), hashedOtp);
    if (!isOtpCorrect) {
      return res.status(401).json({
        status: "fail",
        msg: "Invalid OTP!",
      });
    }

    // Hash password and register the user
    const hashedPasscode = await bcrypt.hash(password, 14);
    const newUser = await User.create({
      email,
      password: hashedPasscode,
      fullName,
    });

    return res.status(201).json({
      status: "success",
      data: {
        user: {
          email: newUser.email,
          fullName: newUser.fullName,
        },
      },
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "fail",
        message: "Data validation failed: " + err.message,
      });
    } else if (err.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Internal Server Error",
      });
    }
  }
});

// Login user
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const currUser = await User.findOne({ email });

    if (!currUser) {
      return res.status(400).json({
        status: "fail",
        message: "User is not Registered.",
      });
    }

    const { password: hashedPassword, fullName, _id } = currUser;
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid password!",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email, _id, fullName },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Set cookie with JWT token
    res.cookie("authorization", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      status: "success",
      message: "User Logged In!",
      data: { user: { email, fullName } },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      msg: "Internal Server error",
    });
  }
});

// Middleware for authorization
app.use((req, res, next) => {
  try {
    const { authorization } = req.cookies;
    if (!authorization) {
      return res.status(401).json({
        status: "fail",
        msg: "Authorization failed!",
      });
    }

    jwt.verify(authorization, process.env.JWT_SECRET_KEY, (error, data) => {
      if (error) {
        return res.status(401).json({
          status: "fail",
          msg: "Authorization failed!",
        });
      } else {
        req.currUser = data;
        next();
      }
    });
  } catch (err) {
    console.error("Error in validation middleware", err);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
});

// Create Task
app.post("/tasks", async (req, res) => {
  try {
    const { assignor, ...taskInfo } = req.body;
    const { email } = req.currUser;
    taskInfo.assignor = email;

    const newTask = await Task.create(taskInfo);

    return res.status(201).json({
      status: "success",
      data: { task: newTask },
    });
  } catch (err) {
    console.error("Error in POST /tasks", err);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
