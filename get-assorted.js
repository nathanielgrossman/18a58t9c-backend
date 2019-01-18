const mongoose = require('mongoose');

const Image = require('./image-schema');
const assortedQueries = require('./assorted-queries')

exports.handler = (event, context, callback) => {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => assortedQueries())
    .then(images => send(images, callback))
    .catch(err => send(err, callback, true))
}

function send(data, callback, err) {
  let body

  if (err) {
    body = data; 
  } else {
    body = {
      images: data,
      total: data.length
    }
  }

  let response = {
    "headers": {
      "Access-Control-Allow-Origin": "*"
    },
    "body": JSON.stringify(body),
    "isBase64Encoded": false
  };
  response.statusCode = err ? 500 : 200;
  mongoose.disconnect();
  callback(null, response);
}