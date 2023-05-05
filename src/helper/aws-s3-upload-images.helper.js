const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3config = require("../config/aws-s3.config");

const s3 = new aws.S3({
  accessKeyId: s3config.s3AccessKey,
  secretAccessKey: s3config.s3SecretAccessKey,
  region: s3config.s3BucketRegion,
});

const uploadS3 = (bucketName, folderName, imageName) =>
  multer({
    storage: multerS3({
      s3,
      bucket: `${bucketName}/${folderName}/${imageName}`,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        // cb(null, `${imageName} ${Date.now()}`);
        cb(null, Date.now().toString() + file.originalname);
      },
    }),
  });

module.exports = uploadS3;