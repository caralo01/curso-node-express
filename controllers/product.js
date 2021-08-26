const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Product = require("../models/product");
class ProductController {
  constructor() {}

  async getProducts(req = request, res = response) {
    const { q, name, apiKey, limit = 5, page = 0 } = req.query;
    const limitNumber = Number(limit);
    const pageNumber = Number(page);
    const query = { state: true };
    const [products, count] = await Promise.all([
      Product.find(query)
        .populate("user", "name")
        .populate("category", "name")
        .limit(limitNumber)
        .skip(pageNumber * limitNumber),
      Product.countDocuments(query),
    ]);

    res.json({
      msg: "get Api - Products",
      products,
      count,
    });
  }

  async getProduct(req = request, res = response) {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("user", "name")
      .populate("category", "name");

    res.json({
      msg: "get id Api - Products",
      product,
    });
  }

  async postProduct(req = request, res = response) {
    try {
      const { state, user, ...body } = req.body;
      const name = req.body.name.toUpperCase();
      const alreadyExist = await Product.findOne({
        name,
      });
      if (!!alreadyExist) {
        return res.status(400).json({
          msg: `Product ${name} already exist`,
        });
      }

      const data = {
        ...body,
        name,
        user: req.user._id,
      };

      const product = new Product(data);

      await product.save();

      res.status(201).json({
        msg: "post Api - Products",
        product,
      });
    } catch (err) {
      throw err;
    }
  }

  async putProduct(req = request, res = response) {
    const { id } = req.params;
    const { state, user, ...body } = req.body;
    if (body.name) {
      body.name = body.name.toUpperCase();
    }
    const data = {
      ...body,
      user: req.user._id,
    };

    // new: true -> Hace que te devuelva product con el valor actual
    // new: false -> Hace que te devuelva product con el valor anterior
    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json({
      msg: "put Api - Products",
      product,
    });
  }

  async deleteProduct(req = request, res = response) {
    const { id } = req.params;

    // Borrar fisicamente
    // const product = await Product.findByIdAndDelete(id);

    const data = {
      state: false,
      user: req.user._id,
    };
    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json({
      msg: "delete Api - Products",
      product,
    });
  }
}

module.exports = ProductController;
