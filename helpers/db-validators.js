const Role = require("../models/role");
const User = require("../models/user");

const isRoleValid = async (role = "") => {
  const existsRole = await Role.findOne({ role });
  if (!existsRole) {
    throw new Error(`The role ${role} don't exists in the DB`);
  }
};

const isUniqueEmail = async (id, req) => {
  const { email } = req.body;
  if (email) {
    const user = await User.findOne({ email });
    if (user.id !== id) {
      throw new Error(`The email ${email} already exist`);
    }
  }
};

const isEmailExist = async (email = "") => {
  // Verificar email existe
  const existEmail = await User.findOne({ email });

  if (!!existEmail) {
    throw new Error(`The email ${email} already exist`);
  }
};

const isUserExist = async (id = "") => {
  // Verificar User existe
  const existUser = await User.findById(id);

  console.log(existUser);

  if (!existUser) {
    throw new Error(`The user with ID ${id} don't exist`);
  }
};

const isLimitNumber = async (id = "") => {
  // Verificar User existe
  const existUser = await User.findById(id);

  if (!existUser) {
    throw new Error(`The user with ID ${id} don't exist`);
  }
};

const isPageNumber = async (id = "") => {
  // Verificar User existe
  const existUser = await User.findById(id);

  if (!existUser) {
    throw new Error(`The user with ID ${id} don't exist`);
  }
};

module.exports = {
  isRoleValid,
  isEmailExist,
  isUniqueEmail,
  isUserExist,
};
