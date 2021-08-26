const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;
const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");
const Role = require("../models/role");

class SearchController {
  constructor() {
    this.allowedCollections = ["users", "categories", "products", "roles"];
  }

  searchUsers = async (term, res = response) => {
    const isMongoId = ObjectId.isValid(term); // TRUE

    if (isMongoId) {
      const user = await User.findById(term);
      return res.json({
        results: user ? [user] : [],
      });
    }

    const regex = new RegExp(term, "i");
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }],
    });

    res.json({
      results: users,
    });
  };

  searchCategories = async (term, res = response) => {
    const isMongoId = ObjectId.isValid(term); // TRUE

    if (isMongoId) {
      const category = await Category.findById(term);
      return res.json({
        results: category ? [category] : [],
      });
    }

    const regex = new RegExp(term, "i");
    const categories = await Category.find({
      $or: [{ name: regex }],
      $and: [{ state: true }],
    });

    res.json({
      results: categories,
    });
  };

  searchProducts = async (term, res = response) => {
    const isMongoId = ObjectId.isValid(term); // TRUE

    if (isMongoId) {
      const product = await Product.findById(term);
      return res.json({
        results: product ? [product] : [],
      });
    }

    const regex = new RegExp(term, "i");
    const products = await Product.find({
      $or: [{ name: regex }],
      $and: [{ state: true }],
    });

    res.json({
      results: products,
    });
  };

  getItems = async (req = request, res = response) => {
    const { collection, term } = req.params;

    if (!this.allowedCollections.includes(collection)) {
      return res.status(400).json({
        msg: `The allowed collections  are: ${this.allowedCollections}`,
      });
    }

    switch (collection) {
      case "users":
        this.searchUsers(term, res);
        break;
      case "categories":
        this.searchCategories(term, res);
        break;
      case "products":
        this.searchProducts(term, res);
        break;
      default:
        return res.status(500).json({
          msg: `Don't exist the collection ${collection}`,
        });
    }
  };
}

module.exports = SearchController;
