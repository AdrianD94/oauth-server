const crypto = require('crypto');
const Client = require('./models/Client');
const Code = require('./models/Code');


module.exports.create = function(userId, clientId, scope, ttl, cb) {
    var code = crypto.randomBytes(32).toString('hex');
    var obj = {code: code, userId: userId, clientId: clientId, scope: scope, ttl: new Date().getTime() + ttl * 1000};

    Code.create(obj,function(err,code){
        if(err){
            return cb(err)
        }else{
           
           return cb(null,code);
  
        }
    })
};

module.exports.fetchByCode = function(code, cb) {
    Code.findOne({code},function(err,client){
        if(err){
            return cb(err)
        }else{
           
           return cb(null,code);
  
        }
    })
};

module.exports.getUserId = function(code) {
    return code.userId;
};

module.exports.getClientId = function(code) {
    return code.clientId;
};

module.exports.getScope = function(code) {
    return code.scope;
};

module.exports.checkTtl = function(code) {
    return (code.ttl > new Date().getTime());
};

module.exports.removeByCode = function(code, cb) {
   Client.findOneAndDelete({code},function(err,client){
        if(err){
            return cb(err)
        }else{
           
           return cb(null,client);
  
        }
    })
};