const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');


// Load User Modal
const User = require('../modals/User')

module.exports = function(passport) {
    passport.use(
        new  LocalStrategy({usernameField : 'email'} , function(email,password,done) {
          //Match User
          User.findOne({email:email} , function(err,user) {
              if (!err) {
                if (!user) {
                    return done(null,false, {message : 'the email is not registred'})
                }

                bcrypt.compare(password , user.password , function(err,isMatch) {
                    if (err) {
                        console.log(err)
                    }
                    if (isMatch) {
                        return done(null , user)
                    }
                    else {
                        return done(null,false , {message : 'Password  incorrect'})
                    }
                })
              }
          })
        
        })
       
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}

