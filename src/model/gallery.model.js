const mongoose = require("mongoose");
const config = require("../config/server.config");
const collectionName = config.galleryCollection;

const gallerySchema = mongoose.Schema({
  image_id: {
    type: String,
    require: true,
  },
  image_name: {
    type: String,
    require: true,
  },
  image_description: {
    type: String,
    require: true,
  },
  image_url: {
    type: String,
    require: true,
  }
});

const GalleryModel = mongoose.model("gallery", gallerySchema, collectionName);
module.exports = GalleryModel;
