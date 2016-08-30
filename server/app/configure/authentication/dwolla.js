var passport = require('passport');
var DwollaStrategy = require('passport-dwolla').Strategy;

var dwolla = require('dwolla-v2');
var dwollaCredentials = require('../../../../../dwollaOauth.js');
module.exports = function (app, db) {
passport.use(new DwollaStrategy({
    clientID: dwollaCredentials.key,
    clientSecret: dwollaCredentials.secret,
    callbackURL: "http://localhost:1337/auth/dwolla/callback",
    scope: "transactions|funding|send",
    environment: 'sandbox'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("^^^^^^^^^Dwolla: ", profile);
    if(req.session.user){
      console.log("****Dowlla: ", profile);
      req.session.user.accessToken = accessToken;
      req.session.user.refreshToken = refreshToken;
    }
    else{
    User.findOrCreate({ dwollaId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
  }
));

app.get('/auth/dwolla',
  passport.authenticate('dwolla', { scope: 'AccountInfoFull' }));

app.get('/auth/dwolla/callback',
  passport.authenticate('dwolla', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
}
