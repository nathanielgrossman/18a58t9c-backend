const mongoose = require("mongoose");

const Image = require("./image-schema");

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

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
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

async function mostPopular() {
  const images = await Image.find()
    .sort({ views: "desc" })
    .skip(random(0, 3))
    .limit(random(3, 5))
    .exec();
  return images;
}

async function leastPopular() {
  const images = await Image.find()
    .sort({ views: "asc" })
    .skip(random(0, 1))
    .limit(random(1, 3))
    .exec();
  return images;
}

async function newest() {
  const images = await Image.find()
    .sort({ created_at: "desc" })
    .limit(random(4, 7))
    .exec();
  return images;
}

async function viewedLeastRecent() {
  const images = await Image.find()
    .sort({ last_viewed: "asc" })
    .limit(random(3, 5))
    .exec();
  return images;
}

async function randomImages() {
  const images = await Image.aggregate().sample(random(4, 6)).exec();
  return images;
}

function assortedQueries() {
  return new Promise((resolve, reject) => {
    const queries = [
      mostPopular,
      leastPopular,
      newest,
      viewedLeastRecent,
      randomImages,
    ];
    const promises = queries.map((query) => query());
    Promise.all(promises)
      .then((arrs) => [].concat(...arrs))
      .then((images) => removeDuplicates(images, "original"))
      .then((uniqueImages) => shuffle(uniqueImages))
      .then((shuffledImages) => resolve(shuffledImages))
      .catch((err) => console.log(err));
  });
}

module.exports = assortedQueries;
