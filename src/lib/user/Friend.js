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

//-- load the Friend Model
require('../../models/Friend');
const Friends = mongoose.model('friends');

//-- Load User model
require('../../models/User');
const Users = mongoose.model('users');

//-- Load User Module
const {findUserByUserName} = require('./User');

//-- App defaults
const defaults = require('../../config/setup');

/**
 * @description This function inserts a new friend for users
 * @param {**}
 * @author Iwuji Jude
 */
async function isMyFriend(userID, friendID) {
  let friendShip = {};

  friendShip = await Friends.findOne({
    user_id: userID,
    friend_id: friendID
  });

  if (friendShip !== null && friendShip !== {}) {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
}

async function formatMyFriendsData(friendsData) {

  if (friendsData instanceof Array && friendsData.length > 0) {

    let formattedFriendsData = [];
    let currentUser = false;

    for (const data of friendsData) {
      currentUser = await Users.findOne({
        _id: data.friend_id
      });

      if (currentUser) {
        formattedFriendsData.push({
          userName: currentUser.userName,
          profilePics: currentUser.pictureDir || defaults.profilePics,
          chat_room_id: data.room_id
        });
      }
    }

    if (formattedFriendsData.length > 0) {
      return Promise.resolve(formattedFriendsData);
    } else {
      return Promise.resolve(false);
    }
  }
}

/**
 * 
 * @param {string} userID 
 * @returns {Promise}
 */
async function getMyFriends(userID = string) {
  let myFriends = null;

  myFriends = await Friends.find({
    user_id: userID
  });

  if (myFriends instanceof Array && myFriends.length > 0) {
    return formatMyFriendsData(myFriends);
  } else {
    return Promise.resolve(false);
  }
}

async function insertFriend(userName, user_id) {
  let friendToBe = await Users.findOne({userName: userName});
  let myFriend = await isMyFriend(user_id, friendToBe._id);

  return new Promise((resolve, reject) => {

    if (friendToBe) { //-- friendToBe was found

      if (!myFriend) { //-- not friends yet
        Friends.countDocuments()
          .then(total => {
            bcrypt.genSalt(12, (err, salt) => {
              if (err) console.log(err);

              let newFriend = new Friends({
                user_id: user_id,
                friend_id: friendToBe._id,
                room_id: ''
              });

              bcrypt.hash(String(total), salt, (err, hash) => {
                newFriend.room_id = hash;

                //-- establishing the friends relationship
                let beFriend = new Friends({
                  user_id: newFriend.friend_id,
                  friend_id: newFriend.user_id,
                  room_id: newFriend.room_id
                });

                newFriend.save()
                  .then(friend => {
                    beFriend.save()
                    resolve(getMyFriends(user_id));
                  })
                  .catch(err => {
                    reject(false);
                  });
              });
            });
          });
      } else {
        resolve(getMyFriends(user_id));
      }
    } else {
      resolve(getMyFriends(user_id)); //-- sends back friends list
    }
  });
}


module.exports = {
  insertFriend,
  getMyFriends,
  isMyFriend
};