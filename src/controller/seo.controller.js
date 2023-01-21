const SeoModel = require("../model/seo.model");
const response = require("../response/response");
const messageResponse = require("../response/messages");


// ### create Seo document ###

const create = async (req, res) => {
  const admin = new SeoModel({
    page_id: req.body.page_id,
    title: req.body.title,
    keywords: req.body.keywords,
    description: req.body.description
  });
  try {
    const totalNumberOfDocuments = await SeoModel.estimatedDocumentCount();
    if (totalNumberOfDocuments === 0) {
      await admin.save();
      const responseObject = response.success(messageResponse.Insert);
      return res.status(200).json(responseObject);
    } else {
      const findDocumentWithUserId = await SeoModel.find(
          {"page_id" : req.body.page_id}
      );
      if (findDocumentWithUserId.length !== 0) {
        const responseObject = response.error(
          messageResponse.alreadyExits("page_id" , req.body.page_id)
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

// ### read Seo document ###

const read = async (req, res) => {
  try {
    const result = await SeoModel.find(
      {"page_id" : req.body.page_id}
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.getOne("seo detail"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("seo detail")
      );
      res.status(200).json(responseObject);
    }
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

// ### readall Seo document ###

const readAll = async (req, res) => {
  try {
    const result = await SeoModel.find(
      {}
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.getOne("seo detail"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("seo detail")
      );
      res.status(200).json(responseObject);
    }
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

// ### update Seo document ###


const update = async (req, res) => {
  try {
    const result = await SeoModel.updateOne(
      {"page_id" : req.body.page_id},
      {
        "title": req.body.title,
        "keywords": req.body.keywords,
        "description": req.body.description
      }
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.updateOne("seo"),
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("seo")
      );
      res.status(200).json(responseObject);
    }
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

// ### remove Seo document ###

const remove = async (req, res) => {
  try {
    const result = await SeoModel.deleteOne(
      {"page_id" : req.body.page_id}
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.removeOne("seo"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("seo detail")
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