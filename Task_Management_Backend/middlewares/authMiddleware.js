const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) return res.status(401).json({ status: "fail", msg: "Authorization failed!" });

  jwt.verify(authorization, process.env.JWT_SECRET_KEY, (error, data) => {
    if (error) return res.status(401).json({ status: "fail", msg: "Authorization failed!" });

    req.currUser = data;
    next();
  });
};
