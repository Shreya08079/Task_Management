const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  try {
    const { email, password, otp, fullName } = req.body;

    const otpDoc = await OTP.findOne({ email }).sort("-createdAt");
    if (!otpDoc) return res.status(400).json({ status: "fail", msg: "OTP expired or not sent" });

    const isOtpCorrect = await bcrypt.compare(otp.toString(), otpDoc.otp);
    if (!isOtpCorrect) return res.status(401).json({ status: "fail", msg: "Invalid OTP!" });

    const hashedPasscode = await bcrypt.hash(password, 14);
    const newUser = await User.create({ email, password: hashedPasscode, fullName });

    return res.status(201).json({ status: "success", user: { email, fullName } });
  } catch (err) {
    return res.status(500).json({ status: "fail", msg: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const currUser = await User.findOne({ email });

    if (!currUser) return res.status(400).json({ status: "fail", msg: "User not registered" });

    const isPasswordCorrect = await bcrypt.compare(password, currUser.password);
    if (!isPasswordCorrect) return res.status(401).json({ status: "fail", msg: "Invalid password" });

    const token = generateToken(currUser);

    res.cookie("authorization", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ status: "success", msg: "User Logged In!", user: { email, fullName: currUser.fullName } });
  } catch (err) {
    return res.status(500).json({ status: "fail", msg: "Internal Server Error" });
  }
};
