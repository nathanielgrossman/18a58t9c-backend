const mongoose = require('mongoose');

const Image = require('./image-schema');

exports.handler = (event, context, callback) => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
        .then(() => {
            Image.find({}, (err, images) => {
                if (err) {
                    let response = {
                        "statusCode": 500,
                        "body": JSON.stringify("error"),
                        "isBase64Encoded": false
                    };
                    mongoose.disconnect();
                    callback(null, response);
                } else {
                    let response = {
                        "statusCode": 200,
                        "headers": {
                          "Access-Control-Allow-Origin" : "*"
                        },
                        "body": JSON.stringify(images),
                        "isBase64Encoded": false
                    };
                    mongoose.disconnect();
                    callback(null, response);
                }
            })
        })
}