const sharp = require('sharp');
const stream = require('stream');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

const Image = require('./image-schema');

const bucketName = process.env.BUCKET_NAME;


let filename;

const webpOptions = {
    quality: 90
}

const jpegOptions = {
    quality: 90
}

exports.handler = (event, context, callback) => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
        .then(() => {
            let oneUploaded = false;

            const newImage = new Image({
                original: event.name
            });
            newImage.save((err, image) => {
                if (err) console.log(err);

                let filename = image._id;

                let encodedImage = event.data;
                let decodedImage = Buffer.from(encodedImage);

                const sharpWebp = sharp(decodedImage).webp(webpOptions)
                const sharpJpg = sharp(decodedImage).jpeg(jpegOptions)

                sharpWebp.pipe(uploadWebp(s3));
                sharpJpg.pipe(uploadJpg(s3));

                function uploadWebp(s3) {
                    const pass = new stream.PassThrough();

                    const params = { Bucket: bucketName, Key: `webp/${filename}.webp`, Body: pass };
                    s3.upload(params, function(err, data) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (oneUploaded) {
                                let response = {
                                    "statusCode": 200,
                                    "body": JSON.stringify("success"),
                                    "isBase64Encoded": false
                                };
                                mongoose.disconnect();
                                callback(null, response);
                            } else {
                                oneUploaded = true;
                            }
                        }
                    });

                    return pass;
                }

                function uploadJpg(s3) {
                    const pass = new stream.PassThrough();

                    const params = { Bucket: bucketName, Key: `jpg/${filename}.jpg`, Body: pass };
                    s3.upload(params, function(err, data) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (oneUploaded) {
                                let response = {
                                    "statusCode": 200,
                                    "body": JSON.stringify("success"),
                                    "isBase64Encoded": false
                                };
                                mongoose.disconnect();
                                callback(null, response);
                            } else {
                                oneUploaded = true;
                            }
                        }
                    });

                    return pass;
                }
            })
        });
};