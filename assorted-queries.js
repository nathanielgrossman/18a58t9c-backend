const mongoose = require('mongoose');

const Image = require('./image-schema');

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

function mostPopular() {
  return new Promise((resolve, reject) => {
    Image.find().sort({ views: 'desc' }).skip(random(0, 3)).limit(random(3, 5)).exec({}, (err, images) => {
      if (err) reject(err);
      resolve(images);
    })
  })
}

function leastPopular() {
  return new Promise((resolve, reject) => {
    Image.find().sort({ views: 'asc' }).skip(random(0, 1)).limit(random(1, 3)).exec({}, (err, images) => {
      if (err) reject(err);
      resolve(images);
    })
  })
}

function newest() {
  return new Promise((resolve, reject) => {
    Image.find().sort({ created_at: 'desc' }).limit(random(4, 7)).exec({}, (err, images) => {
      if (err) reject(err);
      resolve(images);
    })
  })
}

function viewedLeastRecent() {
  return new Promise((resolve, reject) => {
    Image.find().sort({ last_viewed: 'asc' }).limit(random(3, 5)).exec({}, (err, images) => {
      if (err) reject(err);
      resolve(images);
    })
  })
}

function randomImages() {
  return new Promise((resolve, reject) => {
    Image.aggregate().sample(random(4,6)).exec((err, images) => {
      if (err) reject(err);
      resolve(images);
    })
  })
}

function assortedQueries() {
  return new Promise((resolve, reject) => {
    const queries = [
      mostPopular,
      leastPopular,
      newest,
      viewedLeastRecent,
      randomImages
    ]
    const promises = queries.map(query => query())
    Promise.all(promises)
    .then(arrs => [].concat(...arrs))
    .then(images => removeDuplicates(images, 'original'))
    .then(uniqueImages => shuffle(uniqueImages))
    .then(shuffledImages => resolve(shuffledImages))
    .catch(err => console.log(err))
  })
}

module.exports = assortedQueries;