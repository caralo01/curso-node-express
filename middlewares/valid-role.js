const jwt = require("jsonwebtoken");
const { response, request } = require("express");
const User = require("../models/user");

const isAdmin = (req = request, res = response, next) => {
  const { user } = req;

  if (!user) {
    return res
      .status(500)
      .json({ msg: "Role can't verify before it verify token" });
  }

  if (user.role !== "ADMIN_ROLE") {
    return res.status(401).json({ msg: `${user.name} is not admin` });
  }

  next();
};

const hasRole =
  (...roles) =>
  (req = request, res = response, next) => {
    const { user } = req;

    if (!user) {
      return res
        .status(500)
        .json({ msg: "Role can't verify before it verify token" });
    }

    if (!roles.find((role) => role === user.role)) {
      return res.status(401).json({ msg: `${user.name} is not ${roles}` });
    }

    next();
  };

module.exports = {
  isAdmin,
  hasRole,
};
