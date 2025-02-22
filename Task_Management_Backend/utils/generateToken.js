const jwt = require("jsonwebtoken");

module.exports = (user) => {
  return jwt.sign(
    { email: user.email, _id: user._id, fullName: user.fullName },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
};
