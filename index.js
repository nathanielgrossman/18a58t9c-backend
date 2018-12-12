const sharp = require('sharp');
const stream = require('stream');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucketName = process.env.BUCKET_NAME;

let oneUploaded = false;

let filename;

const webpOptions = {
    quality: 90
}

const jpegOptions = {
    quality: 90
}

exports.handler = (event, context, callback) => {
    let filename = event.name.slice(0, event.name.length - 4);

    let encodedImage = event.data;
    let decodedImage = Buffer.from(encodedImage, 'base64');

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
                    callback(null, response);
                } else {
                    oneUploaded = true;
                }
            }
        });

        return pass;
    }

};