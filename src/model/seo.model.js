const mongoose = require("mongoose");
const config = require("../config/server.config");
const collectionName = config.seoCollection;

const seoSchema = mongoose.Schema({
  page_id: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  keywords: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  }
});

const SeoModel = mongoose.model("seo", seoSchema, collectionName);
module.exports = SeoModel;
