const express = require("express");
const fs = require("fs");
var cors = require("cors");
var crawlingFunc = require("./crawl.js");

const app = express();
app.use(cors());

let CharacterAllRate = [];
let CharacterTopRate = [];

const getResult = async () => {
  const result = await crawlingFunc();
  // console.log(result);

  CharacterAllRate = result.allRate;
  CharacterTopRate = result.topRate;
};

getResult().then(() => {
  const CharacterAllRateJson = JSON.stringify(CharacterAllRate);
  fs.writeFileSync("character-all-rate.json", CharacterAllRateJson);

  const CharacterTopRateJson = JSON.stringify(CharacterTopRate);
  fs.writeFileSync("character-top-rate.json", CharacterTopRateJson);
});

app.use(async function (res, res, next) {
  res.status(404);
  console.log("through middleware\n");
  next();
});

app.get("/allRate", async function (req, res, next) {
  res.send(CharacterAllRate);
});

app.get("/topRate", async function (req, res, next) {
  res.send(CharacterTopRate);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
