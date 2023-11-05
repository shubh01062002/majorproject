const mongoose=require("mongoose")
const dotenv=require("dotenv").config()
const Connection = async () => {
    const URL = process.env.MONGO_URL;
    try {
        await mongoose.connect(URL, {});
        console.log('Database Connected Succesfully');
    } catch(error) {
        console.log('err: ', error.message);
    }

};

module.exports= Connection;