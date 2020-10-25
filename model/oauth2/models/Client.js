const mongoose = require('mongoose');


const ClientSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    secret:{
        type:String,
        required:true
    },
    uri:{
        type:String,
        required:true
    },
   scope:[
       {
           type:Array,
           required:false,
           items:{
               type:String,
               enum:["possible", "scope", "values"]
           }
       }
   ],
   grants:
       {
           type:Array,
           required:false,
           items:{
               type:String,
               enum:["authorization_code", "implicit", "password", "client_credentials"]
           }
       }
   
})


module.exports = mongoose.model('Client',ClientSchema);