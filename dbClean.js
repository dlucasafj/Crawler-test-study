const { readFile, writeFile } = require("fs/promises");

const file = __dirname + "/database.json";

const cleanDataBase = async ()=>{
    let currentData = JSON.parse(await readFile(file));

    currentData.length = 0;

    await writeFile(file,JSON.stringify(currentData)).then(()=>{
        console.log("Clean Success")
    }).catch(err=>console.log(err))
}

cleanDataBase();