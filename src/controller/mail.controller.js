const response = require("../response/response");
const messageResponse = require("../response/messages");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config");
const mailConfig = require("../config/mail.config");
const nodemailer = require("nodemailer");

const send = async (req, res) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: mailConfig.Username,
                pass: mailConfig.Password,
            },
        });
        await transporter.sendMail({
            from: req.query.email,
            to: mailConfig.Username,
            subject: req.query.name + " " + req.query.phone,
            text: req.query.message,
        });
        // await transporter.sendMail({
        //     from: req.body.email,
        //     to: mailConfig.Username,
        //     subject: req.body.name + " " + req.body.phone,
        //     text: req.body.message,
        // });
        const responseObject = response.success(messageResponse.emailSent);
        return res.status(200).json(responseObject);
    } catch (error) {
        const responseObject = response.error(error.message);
        return res.status(200).json(responseObject);
    }
};

const sendWithImage = async (req, res) => {
    const uploadImg = uploadS3(
        config.s3CustomerBucketName,
        req.query.phone,
        "mail"
    ).fields([
        { name: "photos", maxCount: 1 }
    ]);
    uploadImg(req, res, async (err) => {
        if (err) {
            const responseObject = response.error(messageResponse.uploadImage(err));
            return res.status(200).json(responseObject);
        } else {
            const photos = req.files.photos.map((file) => {
                return file.location;
            });

            try {
                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: mailConfig.Username,
                        pass: mailConfig.Password,
                    },
                });
                await transporter.sendMail({
                    from: req.query.email,
                    to: mailConfig.Username,
                    subject: req.query.name + " " + req.query.phone,
                    text: req.query.message + "\n\n" + "Here are the attachment below" + "\n" + photos,
                });
                const responseObject = response.success(messageResponse.emailSent);
                return res.status(200).json(responseObject);
            } catch (error) {
                const responseObject = response.error(error.message);
                return res.status(200).json(responseObject);
            }
        }
    })
};


module.exports = {
    send,
    sendWithImage
};