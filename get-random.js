const mongoose = require("mongoose");

const Image = require("./image-schema");

exports.handler = (event, context, callback) => {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(async () => {
      try {
        const count = await Image.count().exec();
        const random = Math.floor(Math.random() * count);
        const image = await Image.findOne().skip(random).exec();
        let response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(image),
          isBase64Encoded: false,
        };
        mongoose.disconnect();
        callback(null, response);
      } catch (err) {
        let response = {
          statusCode: 500,
          body: JSON.stringify("error"),
          isBase64Encoded: false,
        };
        mongoose.disconnect();
        callback(null, response);
      }
    });
};
