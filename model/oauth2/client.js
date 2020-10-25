const Client = require('./models/Client');

module.exports.getId = function(client) {
    return client.id;
};

module.exports.getRedirectUri = getRedirectUri;

module.exports.checkRedirectUri = checkRedirectUri;

module.exports.fetchById = function(clientId, cb) {
    Client.findById(clientId,function(err,client){
        if(err){
            return cb(err)
        }else{
           
           return cb(null,client);
  
        }
    })
};

module.exports.checkSecret = function(client, secret, cb) {
    return cb(null, client.secret == secret);
};

function getRedirectUri(client) {
    return client.redirectUri;
}

function checkRedirectUri(client, redirectUri) {
    return (redirectUri.indexOf(getRedirectUri(client)) === 0 &&
            redirectUri.replace(getRedirectUri(client), '').indexOf('#') === -1);
}