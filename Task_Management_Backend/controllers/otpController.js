const { generateOTP } = require("../utils/generateOTP");
const { sendOtpEmail } = require("../utils/sendEmail");
const OTP = require("../models/otpModel");
const bcrypt = require("bcrypt");

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ status: "fail", message: 'Missing email' });

  const otp = generateOTP();
  const isEmailSent = await sendOtpEmail(email, otp);

  if (!isEmailSent) {
    return res.status(500).json({ status: "fail", message: "Email could not be sent!" });
  }

  const hashedOtp = await bcrypt.hash(otp.toString(), 10);
  await OTP.create({ email, otp: hashedOtp });

  return res.status(201).json({ status: "success", message: `OTP sent to ${email}` });
};
