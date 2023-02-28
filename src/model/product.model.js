const mongoose = require("mongoose");
const config = require("../config/server.config");
const collectionName = config.productCollection;

const productSchema = mongoose.Schema({
  product_id: {
    type: String,
    require: true,
  },
  product_name: {
    type: String,
    require: true,
  },
  product_category: {
    type: String,
    require: true,
  },
  product_dimensions: {
    type: Object,
    require: true,
  },
  product_specification: {
    type: Object,
    require: true,
  },
  product_package: {
    type: Object,
    require: true,
  },
  product_features: {
    type: Array,
    require: true
  },
  product_image: {
    type: String,
    require: true,
  },
  product_images: {
    type: Array,
    require: true,
  },
  product_description: {
    type: String,
    require: true,
  },
  view: {
    type: Number,
    require: true
  }
});

const ProductModel = mongoose.model("product", productSchema, collectionName);
module.exports = ProductModel;
