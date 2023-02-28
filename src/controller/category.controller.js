const CategoryModel = require("../model/category.model");
const response = require("../response/response");
const messageResponse = require("../response/messages");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config");


// ### create category document ###

const create = async (req, res) => {
  const uploadImg = uploadS3(
    config.s3CustomerBucketName,
    req.query.category_id,
    "category"
  ).fields([
    { name: "photos", maxCount: 1 }
  ]);
  uploadImg(req, res, async (err) => {
    if (err) {
      const responseObject = response.error(messageResponse.uploadImage(err));
      return res.status(200).json(responseObject);
    } else {
      const admin = new CategoryModel({
        category_id: req.query.category_id,
        category_name: req.query.category_name,
        category_description: req.query.category_description,
        category_image: req.files.photos[0].location,
        view: 1
      });
      try {
        const totalNumberOfDocuments = await CategoryModel.estimatedDocumentCount();
        if (totalNumberOfDocuments === 0) {
          await admin.save();
          const responseObject = response.success(messageResponse.Insert);
          return res.status(200).json(responseObject);
        } else {
          const findDocumentWithUserId = await CategoryModel.find(
            { "category_id": req.query.category_id }
          );
          if (findDocumentWithUserId.length !== 0) {
            const responseObject = response.error(
              messageResponse.alreadyExits("category_id", req.query.category_id)
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
    }
  })
};

// ### read category document ###

const read = async (req, res) => {
  try {
    const result = await CategoryModel.find(
      { "category_id": req.body.category_id }
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.getOne("category detail"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("category detail")
      );
      res.status(200).json(responseObject);
    }
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

// ### readall category document ###

const readAll = async (req, res) => {
  try {
    const result = await CategoryModel.find(
      {}
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.getOne("category detail"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("category detail")
      );
      res.status(200).json(responseObject);
    }
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

// ### update category document ###


const update = async (req, res) => {
  try {
    const result = await CategoryModel.updateOne(
      { "category_id": req.body.category_id },
      {
        "category_name": req.body.category_name,
        "category_description": req.body.category_description,
      }
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.updateOne("category"),
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("category")
      );
      res.status(200).json(responseObject);
    }
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

// ### remove category document ###

const remove = async (req, res) => {
  try {
    const result = await CategoryModel.deleteOne(
      { "category_id": req.body.category_id }
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.removeOne("category"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("category detail")
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