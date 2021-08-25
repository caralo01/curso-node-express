const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

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
      msg: "post Api - Login",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Concact with ADMIN",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  try {
    const { id_token } = req.body;

    const { name, email, picture } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        img: picture,
        google: true,
        password: "-",
      });

      await user.save();
    }

    // Usuario activo
    if (!user.state) {
      return res.status(404).json({
        msg: "User isn't active",
      });
    }

    // Generar token
    const token = await generateJWT(user.id);

    res.json({
      msg: "post Api - Login Google",
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Concact with ADMIN",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
