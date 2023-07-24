const mongoose = require("mongoose");

const Image = require("./image-schema");

exports.handler = (event, context, callback) => {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })

    .then(async () => {
      let start = null;
      let size = null;
      if (event.queryStringParameters) {
        start = parseInt(event.queryStringParameters.start);
        size = parseInt(event.queryStringParameters.size);
      }
      try {
        const count = await Image.count().exec();
        const images = await Image.find()
          .sort({ created_at: "desc" })
          .skip(start)
          .limit(size)
          .exec();

        let response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            total: count,
            images: images,
          }),
          isBase64Encoded: false,
        };
        mongoose.disconnect();
        callback(null, response);
      } catch (err) {
        let response = {
          statusCode: 500,
          body: JSON.stringify(err),
          isBase64Encoded: false,
        };
        mongoose.disconnect();
        callback(null, response);
      }
    });
};
