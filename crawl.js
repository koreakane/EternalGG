const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getHtml = async () => {
  try {
    return await axios.get(
      "https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vTYndan9I6ZAVdyrZL0mN7346NsdGCgDoC1jOUnzRzDtApBXeqdlN46S_lQKcHQwDV_sO6blm-2qnHO/pubhtml/sheet?headers=false&gid=656104207"
    );
  } catch (error) {
    console.error(error);
  }
};

const nameFinder = (array, index) => {
  let i = 0;

  while (i < index) {
    if (array[index - i].name) {
      return array[index - i].name;
    } else {
      i++;
    }
  }
};

const percentRem = (collection) => {
  return Number(collection.text().replace("%", ""));
};

const crawlingFunc = async () => {
  let allRate = [];
  let topRate = [];

  await getHtml().then((html) => {
    const $ = cheerio.load(html.data);

    const $bodyList = $("tbody").children("tr");

    const average = $($bodyList[9]).children("td");

    const charStatFunc = (htmlCollection, name = "") => {
      let returnList = {};

      returnList = {
        name: $(htmlCollection[1]).text()
          ? $(htmlCollection[1]).text()
          : name,

        weapon: $(htmlCollection[2]).text(),
        solo: {
          winRate: percentRem($(htmlCollection[3])),
          pickRate: percentRem($(htmlCollection[4])),
          killRate: percentRem($(htmlCollection[5])),
          rankingRate: percentRem($(htmlCollection[6])),
        },
        duo: {
          winRate: percentRem($(htmlCollection[7])),
          pickRate: percentRem($(htmlCollection[8])),
          killRate: percentRem($(htmlCollection[9])),
          rankingRate: percentRem($(htmlCollection[10])),
        },
        squad: {
          winRate: percentRem($(htmlCollection[11])),
          pickRate: percentRem($(htmlCollection[12])),
          killRate: percentRem($(htmlCollection[13])),
          rankingRate: percentRem($(htmlCollection[14])),
        },
      };

      return returnList;
    };

    let CharacterAllRate = [];
    let CharacterTopRate = [];

    for (i = 10; i <= 40; i++) {
      CharacterAllRate.push(charStatFunc($($bodyList[i]).children("td")));
    }

    for (i = 46; i <= 76; i++) {
      CharacterTopRate.push(charStatFunc($($bodyList[i]).children("td")));
    }

    allRate = CharacterAllRate.map((val, index) => ({
      ...val,
      name: val.name ? val.name : nameFinder(CharacterAllRate, index),
    }));

    topRate = CharacterTopRate.map((val, index) => ({
      ...val,
      name: val.name ? val.name : nameFinder(CharacterTopRate, index),
    }));
  });

  log(allRate);
  log(topRate);

  return { allRate: allRate, topRate: topRate };
};

module.exports = crawlingFunc;
