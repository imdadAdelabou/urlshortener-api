const mongoose = require("mongoose");
const url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.xsxwg.mongodb.net/?retryWrites=true&w=majority`;


const connectTodb = () => {
    console.log(url);
    return mongoose.connect(url);
}

module.exports = connectTodb;