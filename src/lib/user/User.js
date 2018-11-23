/* Filename: User.js
 * Developer: Iwuji Jude
 * Description: This contains the user logic, It a class that defines the related user 
 * activities
 */

/**
 * module dependencies
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//-- load the User Model
require('../../models/User');
const Users = mongoose.model('users');

//-- App defaults
const defaults = require('../../config/setup');

//-- Friend module
const {isMyFriend} = require('./Friend');


/**
 * @description This function inserts a new user to the database
 * @param {*} userData
 * @returns Promise
 */
async function insertUser(userData = {}) {
  //-- insert a new user
  return new Promise((resolve, reject) => {

    let newUser = new Users(userData);
    bcrypt.genSalt(12, (err, salt) => {

      if (err) console.log(err);

      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) console.log(err);

        newUser.password = hash;

        newUser.save()
          .then(user => {
            if (user) {
              resolve(true);
            } else {
              reject("Sorry, the system encountered an error.");
            }
          })
          .catch(errMsg => {
            reject("Failed to signup the user.");
            console.log(errMsg);
          });
      });

    });
  });
}


/**
 * @description This function search and retrieves users from the database
 * @param {String} userName
 * @returns Promise
 */
async function findUserByUserName(userName) {

  let user = false;

  try {
    user = await Users.findOne({
      userName: userName
    });
  } catch (e) {
    console.log(e);
    user = false;
  }

  //-- returns a Promise
  return new Promise((resolve, reject) => {
    if (user !== {} && user !== null) {
      resolve(user)
    } else {
      resolve(false);
    }
  });
}

/**
 * @description This function search and retrieves users from the database
 * @param {*} userData
 * @returns Promise
 */
async function findUserByEmail(email) {

  let user = {};

  try {
    user = await Users.findOne({
      emailAddress: email
    });
  } catch (e) {
    console.log(e);
    user = false;
  }

  //-- returns a Promise
  return new Promise((resolve, reject) => {
    if (user !== {} && user !== null) {
      return resolve(user)
    } else {
      return resolve(false);
    }
  });
}




async function formatUserData(userData) {
  let formattedUserData = [];
  
  if (userData instanceof Array && userData.length > 0) {

    for (const data of userData) {

      formattedUserData.push({
        userName: data.userName,
        profilePics: data.pictureDir || defaults.profilePics,
      });
    }
  }

  if (formattedUserData.length > 0) {
    return Promise.resolve(formattedUserData);
  } else {
    return Promise.resolve(false);
  }
}


/**
 * @description This function searches for all users that the supplied userName matches
 * @param {String} userName 
 * @returns Promise<boolean> | Promise<Object>
 * @author Iwuji Jude
 */
async function findUsersByUserName(userName, user_id) {
  let userNamePattern = '^.*?' + userName + '.*?$';
  userName = RegExp(userNamePattern);

  let users = false;

  try {
    users = await Users.find({
      userName: userName
    }).sort({
      userName: 'asc'
    });
  } catch (err) {
    throw err;
  }

  if (users) {
    users = await filterUserSearch(user_id, users);
    return formatUserData(users);
  } else {
    return Promise.resolve(false);
  }
}


async function filterUserSearch(user_id, users){
  let filteredUsers = [];
  if(user_id && (users instanceof Array)) {
    for (const user of users) {
      //-- this ensures that the current user is not added to the list
      
      if(String(user._id) !== user_id){

        let isMyFriend_ = await isMyFriend(user_id, user._id);
        //-- Ensure that only users that are not my friend are added to the list
        if(!isMyFriend_){ 
          filteredUsers.push(user);
        }
      }
    }
  }

  return Promise.resolve(filteredUsers);
}



module.exports = {
  insertUser,
  findUserByUserName,
  findUserByEmail,
  findUsersByUserName
};