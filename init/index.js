if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: '../.env' });
}

const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main().then(()=>{
    console.log("connection Successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"687cfa311b7cff9ebdb8946e"}))
    await Listing.insertMany(initData.data);
    console.log("data was saved");
}

initDb();