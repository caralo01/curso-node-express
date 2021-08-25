const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Existe usuario
    if (!user) {
      return res.status(400).json({
        msg: "User or password aren't correct",
      });
    }

    // Usuario activo
    if (!user.state) {
      return res.status(404).json({
        msg: "User isn't active",
      });
    }

    // Validar Password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "User or password aren't correct",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      msg: "post Api - Users",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Concact with ADMIN",
    });
  }
};

module.exports = {
  login,
};
