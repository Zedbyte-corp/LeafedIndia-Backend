const ProductModel = require("../model/product.model");
const response = require("../response/response");
const messageResponse = require("../response/messages");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config");

// ### create Product document ###

const create = async (req, res) => {
	const uploadImg = uploadS3(
		config.s3CustomerBucketName,
		"products",
		req.query.product_name
	).fields([{ name: "photos", maxCount: 5 }]);
	try {
		uploadImg(req, res, async (err) => {
			if (err) {
				const responseObject = response.error(
					messageResponse.uploadImage(err)
				);
				return res.status(200).json(responseObject);
			} else {
				const photos = req.files.photos.map((file) => {
					return file.location;
				});
				var dimensions = {};
				var specifications = {};
				var package = {};
				// var features = [];
				var images = [];
				req.query.product_dimensions.split(",").map((key, value) => {
					switch (value) {
						case 0:
							dimensions["Top Dia"] = key + " MM";
							break;
						case 1:
							dimensions["Height"] = key + " MM";
							break;
						case 2:
							dimensions["Bottom Dia"] = key + " MM";
							break;
					}
				}),
					req.query.product_specification
						.split(",")
						.map((key, value) => {
							switch (value) {
								case 0:
									specifications["Inner Layer"] =
										key + " GSM";
									break;
								case 1:
									specifications["Outer layer"] =
										key + " GSM";
									break;
								case 2:
									specifications["Cup"] = key + " GSM";
									break;
							}
						});
				req.query.product_package.split(",").map((key, value) => {
					switch (value) {
						case 0:
							package["Length"] = key + " CMS";
							break;
						case 1:
							package["Width"] = key + " CMS";
							break;
						case 2:
							package["Height"] = key + " CMS";
							break;
					}
				});
				// req.query.product_features.forEach(value => features.push(parseInt(value)))
				photos.forEach((value) =>
					images.push({
						original: value,
						thumbnail: value,
					})
				);
				const admin = new ProductModel({
					product_id: req.query.product_id,
					product_name: req.query.product_name,
					product_category: req.query.product_category,
					cup_properties: req.query.cup_properties,
					package_properties: req.query.package_properties,
					meat_box_properties: req.query.meat_box_properties,
					// product_dimensions: dimensions,
					// product_specification: specifications,
					// product_package: package,
					// product_features: features,
					product_image: photos[0],
					product_images: images,
					product_description: req.query.product_description,
					view: 2,
				});
				const totalNumberOfDocuments =
					await ProductModel.estimatedDocumentCount();
				if (totalNumberOfDocuments === 0) {
					await admin.save();
					const responseObject = response.success(
						messageResponse.Insert
					);
					return res.status(200).json(responseObject);
				} else {
					const findDocumentWithUserId = await ProductModel.find({
						$and: [
							{ product_id: req.query.product_id },
							{ product_category: req.query.product_category },
						],
					});
					if (findDocumentWithUserId.length !== 0) {
						const responseObject = response.error(
							messageResponse.alreadyExits(
								"product_id",
								req.query.product_id
							)
						);
						res.status(200).json(responseObject);
					} else if (findDocumentWithUserId.length === 0) {
						await admin.save();
						const responseObject = response.success(
							messageResponse.Insert
						);
						return res.status(200).json(responseObject);
					}
				}
			}
		});
	} catch (error) {
		const responseObject = response.error(error.message);
		res.status(200).json(responseObject);
	}
};

// ### read Product document ###

const read = async (req, res) => {
	try {
		const result = await ProductModel.find({
			product_id: req.body.product_id,
		});
		if (result.length !== 0) {
			const responseObject = response.success(
				messageResponse.getOne("product detail"),
				result
			);
			return res.status(200).json(responseObject);
		} else {
			const responseObject = response.error(
				messageResponse.noResult("product detail")
			);
			res.status(200).json(responseObject);
		}
	} catch (error) {
		const responseObject = response.error(error.message);
		res.status(200).json(responseObject);
	}
};

// ### read Product using category document ###

const readCategory = async (req, res) => {
	try {
		const result = await ProductModel.aggregate([
			{ $match: { product_category: req.query.category_id } },
			{
				$addFields: {
					product_id_numeric: {
						$toInt: {
							$substr: [
								"$product_id",
								{
									$indexOfCP: [
										"$product_id",
										{ $substrCP: ["0", 0, 1] },
									],
								},
								-1,
							],
						},
					},
				},
			},
			{ $sort: { product_id_numeric: 1 } },
			{ $project: { product_id_numeric: 0 } },
		]);
		if (result.length !== 0) {
			const responseObject = response.success(
				messageResponse.getOne("product detail"),
				result
			);
			return res.status(200).json(responseObject);
		} else {
			const responseObject = response.error(
				messageResponse.noResult("product detail")
			);
			res.status(200).json(responseObject);
		}
	} catch (error) {
		const responseObject = response.error(error.message);
		res.status(200).json(responseObject);
	}
};

// ### read all Product document ###

const readAll = async (req, res) => {
	try {
		const result = await ProductModel.find({});
		if (result.length !== 0) {
			const responseObject = response.success(
				messageResponse.getOne("product detail"),
				result
			);
			return res.status(200).json(responseObject);
		} else {
			const responseObject = response.error(
				messageResponse.noResult("product detail")
			);
			res.status(200).json(responseObject);
		}
	} catch (error) {
		const responseObject = response.error(error.message);
		res.status(200).json(responseObject);
	}
};

// ### update Product document ###

const update = async (req, res) => {
	try {
		var dimensions = {};
		var specifications = {};
		var package = {};
		// var features = [];
		req.body.product_dimensions
			.split(",")
			.map((key, value) => (dimensions[`Stock Layer${value + 1}`] = key));
		req.body.product_specification.split(",").map((key, value) => {
			switch (value) {
				case 0:
					specifications["Length"] = key + " CM";
					break;
				case 1:
					specifications["Width"] = key + " CM";
					break;
				case 2:
					specifications["Height"] = key + " CM";
					break;
			}
		});
		req.body.product_package.split(",").map((key, value) => {
			switch (value) {
				case 0:
					package["Length"] = key + " CM";
					break;
				case 1:
					package["Width"] = key + " CM";
					break;
				case 2:
					package["Height"] = key + " CM";
					break;
			}
		});
		// req.body.product_features.forEach((value) =>
		// 	features.push(parseInt(value))
		// );
		const result = await ProductModel.updateOne(
			{ product_id: req.body.product_id },
			{
				product_name: req.body.product_name,
				product_category: req.body.product_category,
				cup_properties: req.query.cup_properties,
				package_properties: req.query.package_properties,
				meat_box_properties: req.query.meat_box_properties,
				// product_dimensions: dimensions,
				// product_specification: specifications,
				// product_package: package,
				// product_features: features,
				product_description: req.body.product_description,
			}
		);
		if (result.length !== 0) {
			const responseObject = response.success(
				messageResponse.updateOne("product")
			);
			return res.status(200).json(responseObject);
		} else {
			const responseObject = response.error(
				messageResponse.noResult("product")
			);
			res.status(200).json(responseObject);
		}
	} catch (error) {
		const responseObject = response.error(error.message);
		res.status(200).json(responseObject);
	}
};

// ### remove Product document ###

const remove = async (req, res) => {
	try {
		const result = await ProductModel.deleteOne({
			product_id: req.body.product_id,
		});
		if (result.length !== 0) {
			const responseObject = response.success(
				messageResponse.removeOne("product"),
				result
			);
			return res.status(200).json(responseObject);
		} else {
			const responseObject = response.error(
				messageResponse.noResult("product detail")
			);
			res.status(200).json(responseObject);
		}
	} catch (error) {
		const responseObject = response.error(error.message);
		res.status(200).json(responseObject);
	}
};

module.exports = {
	create,
	read,
	readCategory,
	readAll,
	update,
	remove,
};
