const ProductModel = require("../model/product.model");
const response = require("../response/response");
const messageResponse = require("../response/messages");


// ### create Student document ###

const create = async (req, res) => {
  const admin = new ProductModel({
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    product_category: req.body.product_category,
    product_dimensions: req.body.product_dimensions,
    product_variant: req.body.product_variant,
    product_images: req.body.product_images,
    product_description: req.body.product_description,
    product_mrp: req.body.product_mrp
  });
  try {
    const totalNumberOfDocuments = await ProductModel.estimatedDocumentCount();
    if (totalNumberOfDocuments === 0) {
      await admin.save();
      const responseObject = response.success(messageResponse.Insert);
      return res.status(200).json(responseObject);
    } else {
      const findDocumentWithUserId = await ProductModel.find(
          {"product_id" : req.body.product_id}
      );
      if (findDocumentWithUserId.length !== 0) {
        const responseObject = response.error(
          messageResponse.alreadyExits("product_id" , req.body.product_id)
        );
        res.status(200).json(responseObject);
      } else if (findDocumentWithUserId.length === 0) {
        await admin.save();
        const responseObject = response.success(messageResponse.Insert);
        return res.status(200).json(responseObject);
      }
    }
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

const read = async (req, res) => {
  try {
    const result = await ProductModel.find(
      {"product_id" : req.body.product_id}
    );
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

const readAll = async (req, res) => {
  try {
    const result = await ProductModel.find(
      {}
    );
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


const update = async (req, res) => {
  try {
    const result = await ProductModel.updateOne(
      {"product_id" : req.body.product_id},
      {
        "product_name": req.body.product_name,
        "product_category": req.body.product_category,
        "product_dimensions": req.body.product_dimensions,
        "product_variant": req.body.product_variant,
        "product_images": req.body.product_images,
        "product_description": req.body.product_description,
        "product_mrp": req.body.product_mrp
      }
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.updateOne("product"),
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

const remove = async (req, res) => {
  try {
    const result = await ProductModel.deleteOne(
      {"product_id" : req.body.product_id}
    );
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
    readAll,
    update,
    remove
  };