const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'Users'
    },
    clientId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'Client'
    },
    code:{
        type:String,
        required:true
    },
    scope:
       {
           type:Array,
           required:false,
           items:{
               type:String,
               enum:["possible", "scope", "values"]
           }
       }
})


module.exports = mongoose.model('Code',CodeSchema);