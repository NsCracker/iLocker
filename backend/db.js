require("dotenv").config({ path: './.env.local' });
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_DB_URL

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;

