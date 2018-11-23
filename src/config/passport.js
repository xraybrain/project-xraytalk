/**
 * Module dependencies
 */
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

//-- Load User Model
require('../models/User');
const Users = mongoose.model('users');

module.exports = function(passport){
  passport.use(new LocalStrategy((username, password, done)=>{
    //-- Match user
    Users.findOne({userName: username})
     .then(user => {
       if(!user){
         return done(null, false, {message: 'No User with such username found.'});
       }

       //-- Match password
       bcrypt.compare(password, user.password, (err, isMatch)=>{
        if (err) throw err;

        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Password Incorrect'});
        }
       });
     })
     .catch(err => console.log(err));
  }))

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    Users.findById(id, function(err, user){
      done(err, user);
    });
  });

};