const GalleryModel = require("../model/gallery.model");
const response = require("../response/response");
const messageResponse = require("../response/messages");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config");


// ### create Gallery document ###

const create = async (req, res) => {
  const uploadImg = uploadS3(
    config.s3CustomerBucketName,
    "gallery",
    req.query.image_id
  ).fields([
    { name: "photos", maxCount: 1 }
  ]);
  uploadImg(req, res, async (err) => {
    if (err) {
      const responseObject = response.error(messageResponse.uploadImage(err));
      return res.status(200).json(responseObject);
    } else {
      const admin = new GalleryModel({
        image_id: req.query.image_id,
        image_name: req.query.image_name,
        image_url: req.files.photos[0].location
      });
      try {
        const totalNumberOfDocuments = await GalleryModel.estimatedDocumentCount();
        if (totalNumberOfDocuments === 0) {
          await admin.save();
          const responseObject = response.success(messageResponse.Insert);
          return res.status(200).json(responseObject);
        } else {
          const findDocumentWithUserId = await GalleryModel.find(
            { "image_id": req.query.image_id }
          );
          if (findDocumentWithUserId.length !== 0) {
            const responseObject = response.error(
              messageResponse.alreadyExits("image_id", req.query.image_id)
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

// ### read Gallery document ###

const read = async (req, res) => {
  try {
    const result = await GalleryModel.find(
      { "image_id": req.body.image_id }
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.getOne("gallery detail"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("gallery detail")
      );
      res.status(200).json(responseObject);
    }
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};


// ### read all Gallery document ###


const readAll = async (req, res) => {
  try {
    const result = await GalleryModel.find(
      {}
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.getOne("gallery detail"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("gallery detail")
      );
      res.status(200).json(responseObject);
    }
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};


// ### update Gallery document ###

const update = async (req, res) => {
  try {
    const result = await GalleryModel.updateOne(
      { "image_id": req.body.image_id },
      {
        "image_name": req.body.image_name,
        "image_description": req.body.image_description,
      }
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.updateOne("image"),
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("image")
      );
      res.status(200).json(responseObject);
    }
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

// ### remove Gallery document ###

const remove = async (req, res) => {
  try {
    const result = await GalleryModel.deleteOne(
      { "image_id": req.body.image_id }
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.removeOne("image"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("image detail")
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