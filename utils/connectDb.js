const mongoose = require('mongoose');
const dotenv = require('dotenv').config({path:"../conf/conf.env"});

const connectDb = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useCreateIndex:true,
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        console.log(`MongoDB connected at http://${conn.connection.host}:${conn.connection.port}`);
    } catch (error) {
        console.log(error); 
    }
}


module.exports = connectDb;