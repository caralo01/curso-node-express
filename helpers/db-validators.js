const Category = require("../models/category");
const Product = require("../models/product");
const Role = require("../models/role");
const User = require("../models/user");

// USER

const isRoleValid = async (role = "") => {
  const existsRole = await Role.findOne({ role });
  if (!existsRole) {
    throw new Error(`The role ${role} doesn't exists in the DB`);
  }
};

const isUniqueEmail = async (id, req) => {
  const { email } = req.body;
  if (email) {
    const user = await User.findOne({ email });
    if (user && user.uid !== id) {
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

  if (!existUser) {
    throw new Error(`The user with ID ${id} doesn't exist`);
  }
};

// CATEGORY

const isCategoryExist = async (id = "") => {
  // Verificar Category existe
  const existCategory = await Category.findById(id);

  if (!existCategory) {
    throw new Error(`The category with ID ${id} doesn't exist`);
  }
};

const isUniqueCategoryName = async (id, req) => {
  const name = req.body.name.toUpperCase();
  if (name) {
    const category = await Category.findOne({ name });
    if (category && category.id !== id) {
      throw new Error(`The name ${name} already exist`);
    }
  }
};

// Product

const isProductExist = async (id = "") => {
  // Verificar Product existe
  const existProduct = await Product.findById(id);

  if (!existProduct) {
    throw new Error(`The product with ID ${id} doesn't exist`);
  }
};

const isUniqueProductName = async (id, req) => {
  const name = req.body.name.toUpperCase();
  if (name) {
    const product = await Product.findOne({ name });
    if (product && product.id !== id) {
      throw new Error(`The name ${name} already exist`);
    }
  }
};

module.exports = {
  isRoleValid,
  isEmailExist,
  isUniqueEmail,
  isUserExist,
  isCategoryExist,
  isUniqueCategoryName,
  isProductExist,
  isUniqueProductName,
};
