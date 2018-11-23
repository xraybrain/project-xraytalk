/**
 * Filename: user.js
 * Developer: Iwuji Jude
 * Description: This handles the users route
 */
/**
 * Module dependencies
 */
const router = require('express').Router();
const passport = require('passport');

//-- Load the Validator utility module
const validator = require('../lib/utils/validator');

//-- Load the User module
const {insertUser, findUserByUserName, findUserByEmail, findUsersByUserName} = require('../lib/user/User');

//-- Load the Friends module
const {getMyFriends, insertFriend} = require('../lib/user/Friend');

//-- Load Chat
const {findChatsToLimit} = require('../lib/chat/Chat');



router.get('/chat/', (req, res) => {
  res.render('chat/chat-frame', {
    pageTitle: 'XrayTalk | Chatting'
  });
});


//-- Process user registeration
router.post('/register', (req, res)=>{
  let errors = [];

  //-- Validate userName
  if(!validator.isRealName(req.body.userName)){
    errors.push({userNameError: 'Not a real UserName'});
  }

  //-- Validate email
  if(!validator.isEmail(req.body.email)){
    errors.push({emailAddressError: 'Not a valid email address'});
  }

  //-- Validate password
  if(!validator.isRealPassword(req.body.password)){
    errors.push({passwordError: 'Please ensure that your password has Uppercase, Lowercase, and digit in range [5-10]'});
  }

  //-- Match passwords
  if(req.body.password !== req.body.confirmPassword){
    errors.push({confirmPasswordError: 'Password mismatch'});
  }

  //-- Check if userName already exists
  findUserByUserName(req.body.userName)
    .then(user => {
      if(user){
        errors.push({userNameError: 'UserName already exists'});
      }

      //-- Check if email already exists
      findUserByEmail(req.body.email)
       .then(user => {
         if(user){
          errors.push({emailAddressError: 'Email address already exists'});
         }

         //-- Check if there are errors
        if(errors.length > 0){
          res.render('index/index',{
            errors
          });
        } else {
          let newUser = {
            userName: validator.sanitize(req.body.userName),
            emailAddress: validator.sanitize(req.body.email),
            password: validator.sanitize(req.body.password)
          };

          //-- insert the user
          insertUser(newUser)
           .then(inserted => {
             if(inserted){
               req.flash('success_msg', 'Welcome to XrayTalk, start chatting with friends!');
               res.redirect('/');
             }
           })
           .catch(err => {
             if(err){
              req.flash('error_msg', err);
              res.redirect('/');
             }
           })
        }
       })
    })
    .catch(err=>console.log(err));
});


//-- Process Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local',{
    successRedirect:'/', 
    failureRedirect:'/', 
    failureFlash: true})(req, res, next);
});

//-- Process [ajax] get friends request
router.post('/getfriends', (req, res, next) => {
  let userID = req.user.id;

  getMyFriends(userID)
   .then(friends => {
    res.send(friends)
   })
   .catch(err => {
     console.log(err);
     next();
   });
});

//-- Process [ajax] get users with supplied userName
router.post('/getUsers/', (req, res) => {
  let userName = req.body.userName;
  let userID   = req.user.id;

  findUsersByUserName(userName, userID)
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      console.log(err);
      next();
    });
});

//-- Process [ajax] addFriend request
router.post('/addFriend', (req, res)=>{
  let friendUserName = req.body.friendUserName;
  let userID = req.user.id;

  insertFriend(friendUserName, userID)
    .then(friends => {
      res.send(friends);
    })
    .catch(err => console.log(err));

});

//-- Process [ajax] getChats request
router.post('/getChats/', (req, res)=>{
  chatRoomId = req.body.roomId;
  userId = req.user.id;

  findChatsToLimit(chatRoomId, 25, userId)
  .then(chats => {
    res.send(chats);
  })
  .catch(err => console.log(err));
});

//-- Logout user
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
})

module.exports = router;