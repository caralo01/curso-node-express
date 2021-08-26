const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Category = require("../models/category");
class CategoryController {
  constructor() {}

  async getCategories(req = request, res = response) {
    const { q, name, apiKey, limit = 5, page = 0 } = req.query;
    const limitNumber = Number(limit);
    const pageNumber = Number(page);
    const query = { state: true };
    const [categories, count] = await Promise.all([
      Category.find(query)
        .populate("user", "name")
        .limit(limitNumber)
        .skip(pageNumber * limitNumber),
      Category.countDocuments(query),
    ]);

    res.json({
      msg: "get Api - Categories",
      categories,
      count,
    });
  }

  async getCategory(req = request, res = response) {
    const { id } = req.params;

    const category = await Category.findById(id).populate("user", "name");

    res.json({
      msg: "get id Api - Categories",
      category,
    });
  }

  async postCategory(req = request, res = response) {
    try {
      const name = req.body.name.toUpperCase();

      const alreadyExist = await Category.findOne({ name });
      console.log(alreadyExist);
      if (!!alreadyExist) {
        return res.status(400).json({
          msg: `Category ${name} already exist`,
        });
      }

      const data = {
        name,
        user: req.user._id,
      };

      const category = new Category(data);

      await category.save();

      res.status(201).json({
        msg: "post Api - Categories",
        category,
      });
    } catch (err) {
      throw err;
    }
  }

  async putCategory(req = request, res = response) {
    const { id } = req.params;
    const name = req.body.name.toUpperCase();
    const data = {
      name,
      user: req.user._id,
    };

    // new: true -> Hace que te devuelva category con el valor actual
    // new: false -> Hace que te devuelva category con el valor anterior
    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.json({
      msg: "put Api - Categories",
      category,
    });
  }

  async deleteCategory(req = request, res = response) {
    const { id } = req.params;

    // Borrar fisicamente
    // const category = await Category.findByIdAndDelete(id);

    const data = {
      state: false,
      user: req.user._id,
    };
    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.json({
      msg: "delete Api - Categories",
      category,
    });
  }
}

module.exports = CategoryController;
