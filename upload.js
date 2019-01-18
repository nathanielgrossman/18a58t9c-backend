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

const thumbOptions = {
    quality: 80
}

const thumbSize = 600;

exports.handler = (event, context, callback) => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
        .then(() => {
            let uploaded = 0;

            let rgb = `rgb(${event.color.join(', ')})`;
            const newImage = new Image({
                original: event.name,
                color: rgb
            });
            newImage.save((err, image) => {
                if (err) console.log(err);

                let filename = image._id;

                let encodedImage = event.data;
                let decodedImage = Buffer.from(encodedImage);

                const sharpWebp = sharp(decodedImage).webp(webpOptions)
                const sharpJpg = sharp(decodedImage).jpeg(jpegOptions)
                const sharpThumb = sharp(decodedImage).resize(thumbSize, thumbSize, { fit:'inside' }).jpeg(thumbOptions)


                sharpWebp.pipe(upload(s3, 'webp'));
                sharpJpg.pipe(upload(s3, 'jpg'));
                sharpThumb.pipe(upload(s3, 'jpg', true));

                function upload(s3, format, thumb) {
                    const pass = new stream.PassThrough();
                    const key = thumb ? `thumbs/${filename}.${format}` : `${format}/${filename}.${format}`;
                    const params = { Bucket: bucketName, Key: key, Body: pass };
                    s3.upload(params, function(err, data) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (uploaded === 2) {
                                let response = {
                                    "statusCode": 200,
                                    "body": JSON.stringify("success"),
                                    "isBase64Encoded": false
                                };
                                mongoose.disconnect();
                                callback(null, response);
                            } else {
                                uploaded++;
                            }
                        }
                    });

                    return pass;
                }

                
            })
        });
};