const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  });

  UserSchema.statics.matchPassword = async function (unCryptedPassword,cryptedPassword,) {
    
    try {
        return await bcrypt.compare(unCryptedPassword,cryptedPassword);
       
    } catch (error) {
        console.log(error);
    }
    
  };


module.exports = mongoose.model('User',UserSchema);