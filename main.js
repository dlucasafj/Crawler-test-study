const axios = require("axios");
const cheerio = require("cheerio");
const { Worker } = require("worker_threads");
let workDir = __dirname + "/dbWorker.js";

const mainFunc = async () => {
  const url = "https://www.iban.com/exchange-rates";

  let res = await fetchData(url);
  if (!res.data) {
    console.log("Invalid data Obj");
    return;
  }

  const html = res.data;
  let dataObj = new Object();

  const $ = cheerio.load(html);

  const statsTable = $(
    ".table.table-bordered.table-hover.downloads > tbody > tr"
  );

  statsTable.each(function () {
    let title = $(this).find("td").text();
    let newStr = title.split("\t");
    newStr.shift();

    formatStr(newStr, dataObj);
  });

  return dataObj;
};

async function fetchData(url) {
  console.log("Crawliing data...");

  let response = await axios(url).catch((err) => console.log(err));

  if (response.status !== 200) {
    console.log("Error occurrend while fetching data");
    return;
  }
  return response;
}

mainFunc().then((res) => {
  //start worker

  const worker = new Worker(workDir);
  console.log("Sending crawled data to dbWorker");

  //send formatted data to worker thread
  worker.postMessage(res);

  //listen to message from worker thread
  worker.on("message", (message) => {
    console.log(message);
  });
});

function formatStr(arr, dataObj) {
  //regex to match all the words before the first digit

  let regExp = /[^A-Z]*(^\D+)/;
  let newArr = arr[0].split(regExp);
  dataObj[newArr[1]] = newArr[2];
}
