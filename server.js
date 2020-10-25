const express = require('express');
const connectDb = require('./utils/connectDb');
const dotenv = require('dotenv').config({path:'./conf/conf.env'});

const cookieParser = require('cookie-parser');
const session = require('express-session');
const query  = require('querystring');

const oauth20= require('./oauth20.js')();
const model= require('./model/');

const app = express();

const PORT = process.env.PORT || 9001;


connectDb();


oauth20.renewRefreshToken = true;

app.set('oauth2', oauth20);

// Middleware
app.use(cookieParser());
app.use(session({ secret: 'oauth20-provider-test-server', resave: false, saveUninitialized: false }));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(oauth20.inject());

// View
app.set('views', './view');
app.set('view engine', 'jade');


function isUserAuthorized(req, res, next) {
    if (req.session.authorized) next();
    else {
        var params = req.query;
        params.backUrl = req.path;
        res.redirect('/login?' + query.stringify(params));
    }
}


// Define OAuth2 Authorization Endpoint
app.get('/authorization', isUserAuthorized, oauth20.controller.authorization, function(req, res) {
    res.render('authorization', { layout: false });
});
app.post('/authorization', isUserAuthorized, oauth20.controller.authorization);

// Define OAuth2 Token Endpoint
app.post('/token', oauth20.controller.token);

// Define user login routes
app.get('/login', function(req, res) {
    res.render('login', {layout: false});
});

app.post('/login', function(req, res, next) {
   
    var backUrl = req.query.backUrl ? req.query.backUrl : '/';
    delete(req.query.backUrl);
    backUrl += backUrl.indexOf('?') > -1 ? '&' : '?';
    backUrl += query.stringify(req.query);

    // Already logged in
    if (req.session.authorized) res.redirect(backUrl);
    // Trying to log in
    else if (req.body.username && req.body.password) {
        model.oauth2.user.fetchByUsername(req.body.username, function(err, user) {
           
            if (err) next(err);
            else {
                model.oauth2.user.checkPassword(user, req.body.password, function(err, valid) {
                 
                    if (err) next(err);
                    else if (!valid) res.redirect(req.url);
                    else {
                        
                        req.session.user = user;
                        req.session.authorized = true;
                        
                        res.redirect(backUrl);
                    }
                });
            }
        });
    }
    // Please login
    else res.redirect(req.url);
});

// Some secure method
app.get('/secure', oauth20.middleware.bearer, function(req, res) {
    if (!req.oauth2.accessToken) return res.status(403).send('Forbidden');
    if (!req.oauth2.accessToken.userId) return res.status(403).send('Forbidden');
    res.send('Hi! Dear user ' + req.oauth2.accessToken.userId + '!');
});

// Some secure client method
app.get('/client', oauth20.middleware.bearer, function(req, res) {
    if (!req.oauth2.accessToken) return res.status(403).send('Forbidden');
    res.send('Hi! Dear client ' + req.oauth2.accessToken.clientId + '!');
});




app.listen(PORT,()=>console.log(`Server started at port ${PORT}`));


