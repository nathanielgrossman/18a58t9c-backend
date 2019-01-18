const mongoose = require('mongoose');

const Image = require('./image-schema');

exports.handler = (event, context, callback) => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
        .then(() => {
            Image.count().exec((err, count) => {
                const random = Math.floor(Math.random() * count)
                Image.findOne().skip(random).exec((err, image) => {
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
                                "Access-Control-Allow-Origin": "*"
                            },
                            "body": JSON.stringify(image),
                            "isBase64Encoded": false
                        };
                        mongoose.disconnect();
                        callback(null, response);
                    }
                })
            })
        })
}