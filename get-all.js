const mongoose = require('mongoose');

const Image = require('./image-schema');

exports.handler = (event, context, callback) => {
    let start = null;
    let size = null;
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
        .then(() => {
            if (event.queryStringParameters) {
                start = parseInt(event.queryStringParameters.start);
                size = parseInt(event.queryStringParameters.size);
            }
            Image.count().exec((err, count) => {
                Image.find().sort({ $natural: -1 }).skip(start).limit(size).exec({}, (err, images) => {
                    if (err) {
                        let response = {
                            "statusCode": 500,
                            "body": JSON.stringify(err),
                            "isBase64Encoded": false
                        };
                        mongoose.disconnect();
                        callback(null, response);
                    } else {
                        let response = {
                            "statusCode": 200,
                            "headers": {
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Credentials": true
                            },
                            "body": JSON.stringify({
                                total: count,
                                images: images
                            }),
                            "isBase64Encoded": false
                        };
                        mongoose.disconnect();
                        callback(null, response);
                    }
                })
            })
        })
}