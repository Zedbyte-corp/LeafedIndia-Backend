const mongoose = require("mongoose");
const config = require("../config/server.config");
const collectionName = config.categoryCollection;

const categorySchema = mongoose.Schema({
	category_id: {
		type: String,
		require: true,
	},
	category_name: {
		type: String,
		require: true,
	},
	category_description: {
		type: String,
		require: true,
	},
	category_image: {
		type: String,
		require: true,
	},
	view: {
		type: Number,
		require: true,
	},
	pre_category_id: {
		type: Number,
		require: true,
	},
});

const CategoryModel = mongoose.model(
	"category",
	categorySchema,
	collectionName
);
module.exports = CategoryModel;
