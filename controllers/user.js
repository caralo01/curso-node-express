const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
class UserController {
  constructor() {}

  async getUsers(req = request, res = response) {
    const { q, name, apiKey, limit = 5, page = 0 } = req.query;
    const limitNumber = Number(limit);
    const pageNumber = Number(page);
    const query = { state: true };
    const [users, count] = await Promise.all([
      User.find(query)
        .limit(limitNumber)
        .skip(pageNumber * limitNumber),
      User.countDocuments(query),
    ]);

    res.json({
      msg: "get Api - Users",
      users,
      count,
    });
  }

  async postUser(req = request, res = response) {
    try {
      const { name, email, password, role } = req.body;
      const user = new User({ name, email, password, role });

      // Encriptar password
      const salt = bcryptjs.genSaltSync();
      user.password = bcryptjs.hashSync(user.password, salt);

      await user.save();

      res.json({
        msg: "post Api - Users",
        user,
      });
    } catch (err) {
      throw err;
    }
  }

  async putUser(req = request, res = response) {
    const { id } = req.params;
    const { _id, password, google, ...rest } = req.body;

    if (password) {
      // Encriptar password
      const salt = bcryptjs.genSaltSync();
      rest.password = bcryptjs.hashSync(user.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);

    res.json({
      msg: "put Api - Users",
      user,
    });
  }

  patchUser(req = request, res = response) {
    res.json({
      msg: "patch Api - Users",
    });
  }

  async deleteUser(req = request, res = response) {
    const { id } = req.params;

    // Borrar fisicamente
    // const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, { state: false });

    res.json({
      msg: "delete Api - Users",
      user,
    });
  }
}

module.exports = UserController;
