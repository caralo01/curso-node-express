const jwt = require("jsonwebtoken");
const { response, request } = require("express");
const User = require("../models/user");

const validJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ msg: "Token not exist" });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({ msg: "User not exist" });
    }

    if (!user.state) {
      return res.status(401).json({ msg: "User has deleted" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Token isn't valid",
    });
  }
};

module.exports = {
  validJWT,
};
