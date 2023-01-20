const categoryModel = require("../model/category.model");
const response = require("../response/response");
const messageResponse = require("../response/messages");


// ### create Student document ###

const create = async (req, res) => {
  const admin = new categoryModel({
    category_id: req.body.category_id,
    category_name: req.body.category_name,
  });
  try {
    const totalNumberOfDocuments = await categoryModel.estimatedDocumentCount();
    if (totalNumberOfDocuments === 0) {
      await admin.save();
      const responseObject = response.success(messageResponse.Insert);
      return res.status(200).json(responseObject);
    } else {
      const findDocumentWithUserId = await categoryModel.find(
          {"category_id" : req.body.category_id}
      );
      if (findDocumentWithUserId.length !== 0) {
        const responseObject = response.error(
          messageResponse.alreadyExits("category_id" , req.body.category_id)
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
    const result = await categoryModel.find(
      {"category_id" : req.body.category_id}
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

const readAll = async (req, res) => {
  try {
    const result = await categoryModel.find(
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


const update = async (req, res) => {
  try {
    const result = await categoryModel.updateOne(
      {"category_id" : req.body.category_id},
      {
        "category_name": req.body.category_name
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

const remove = async (req, res) => {
  try {
    const result = await categoryModel.deleteOne(
      {"category_id" : req.body.category_id}
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