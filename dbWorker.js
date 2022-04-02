const { parentPort } = require("worker_threads");
const { readFile, writeFile } = require("fs/promises");

const file = __dirname + "/database.json";

parentPort.once("message", async (message) => {
  console.log("Received data from mainWorker...");

  let current = JSON.parse(await readFile(file));

  current.push(message);

  await writeFile(file, JSON.stringify(current))
    .then(() => {
      console.log("Data Savad Successfully");
    })
    .catch((err) => console.error(err));
});
