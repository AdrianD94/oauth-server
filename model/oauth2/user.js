const User = require('./models/User');


module.exports.getId = function(user) {
    return user._id;
   
};

module.exports.fetchById =function(id, cb) {
  User.findById(id,function(err,user){
      if(err){
          return cb(err)
      }else{
         return cb(null,user);

      }
  })
};


module.exports.fetchByUsername = function(username, cb) {
   User.findOne({username},function(err,user){
       if(err){
          return cb(err)
       }else{
          return cb(null,user);
       }
   })
};



module.exports.checkPassword = function(user, password, cb) {
  User.matchPassword(password,user.password).then(result=>{
       result ? cb(null,true) : cb(null,false);
   });
    
};

module.exports.fetchFromRequest = function(req) {
    return req.session.user;
};