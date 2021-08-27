const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    deafult: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  img: {
    type: String,
  },
});

ProductSchema.methods.toJSON = function () {
  const { __v, _id, state, ...product } = this.toObject();
  product.id = _id;
  return product;
};

module.exports = model("Product", ProductSchema);
