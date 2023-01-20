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
    type: String,
    require: true,
  },
  product_variant: {
    type: String,
    require: true,
  },
  product_images: {
    type: String,
    require: true,
  },
  product_description: {
    type: String,
    require: true,
  },
  product_mrp: {
    type: String,
    require: true,
  }
});

const ProductModel = mongoose.model("product", productSchema, collectionName);
module.exports = ProductModel;
