const mongoose = require('mongoose');

const Image = require('./image-schema');

exports.handler = (event, context, callback) => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
        .then(() => {
            Image.findByIdAndUpdate(
                event.id, { $inc: { views: 1 }, $set: { last_viewed: Date.now() } },
                (err, image) => {
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
                            "body": JSON.stringify(event.id + ' updated'),
                            "isBase64Encoded": false
                        };
                        mongoose.disconnect();
                        callback(null, response);
                    }
                })
        })
}