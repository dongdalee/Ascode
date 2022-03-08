var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

// serialize & deserialize User
// login시에 DB에서 발견한 user를 어떻게 session에 저장할지 정한다. -> user의 id만 session에 저장한다.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// request시에 session에서 어떻게 user object를 만들지 정한다.
passport.deserializeUser(function(id, done) {
  User.findOne({_id:id}, function(err, user) {
    done(err, user);
  });
});

// local strategy 로그인시 호출, DB에서 해당 user를 찾고 user.authenticate를 실행
passport.use('local-login',
  new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      User.findOne({username:username})
        .select({password:1})
        .exec(function(err, user) {
          if (err) return done(err);

          if (user && user.authenticate(password)){
            return done(null, user);
          }
          else {
            req.flash('username', username);
            req.flash('errors', {login:'The username or password is incorrect.'});
            return done(null, false);
          }
        });
    }
  )
);

module.exports = passport;
