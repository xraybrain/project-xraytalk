/* Filename: Chat.js
 * Developer: Iwuji Jude
 * Decription: This handles the chatting logic/functionality
 */
/**
 * Module dependencies
 */
const mongoose = require('mongoose');

//-- Load the Chat model
require('../../models/Chat');
const Chats = mongoose.model('chats');

//-- Load the User model
require('../../models/User');
const Users = mongoose.model('users');

const validator = require('../utils/validator');


function generateMessage(userID, message=null, chat_room_id=null){
  let generatedMessage = {};

  if(!validator.isEmpty(message) ||!validator.isEmpty(chat_room_id)){
    generatedMessage = {
      chat_room_id: validator.sanitize(chat_room_id),
      message: validator.sanitize(message),
      mimeType: "message/text",
      createdAt: new Date(),
      user_id: userID
    }
  }

  return generatedMessage;
}

/**
 * 
 * @param {*} user_id 
 * @param {*} chats 
 */
async function formatChat(user_id = null, chats) {
  let formattedChats = [];
  let user = null;

  if (chats instanceof Array) {
    for (const chat of chats) {
      user = await Users.findById(chat.user_id);
      if (user !== null && user !== {}) {
        let tempObj = {};
        tempObj.userName = user.userName;
        tempObj.profilePics = user.profilePics || '/core/img/user.png';
        tempObj.message = chat.message;
        tempObj.uid = user_id;

        if (user_id === String(user._id)) {
          tempObj.userType = "user";
        } else {
          tempObj.userType = "friend";
        }
        formattedChats.push(tempObj);
      }
    }
  } else {
    user = await Users.findById(chats.user_id);
    if (user !== null && user !== {}) {
      let tempObj = {};
      tempObj.userName = user.userName;
      tempObj.profilePics = user.profilePics || '/core/img/user.png';
      tempObj.message = chats.message;
      tempObj.uid = user_id;

      if (user_id === user._id + '') {
        tempObj.userType = "user";
      } else {
        tempObj.userType = "friend";
      }
      formattedChats.push(tempObj);
    }
  }
  return Promise.resolve(formattedChats);
}


/**
 * 
 * @param {*} chatData 
 */
async function insertChat(chatData={}){
  if (!validator.isEmpty(chatData)) {
    let newMessage = {};

    try {
      newMessage = new Chats(chatData);
    } catch (err) {
      return Promise.resolve({errMsg: 'Required fields are omitted.'});
    }

    if(!validator.isEmpty(newMessage)) {
      newMessage.save();
      return formatChat(newMessage.user_id,newMessage);
    }    
  }

  return Promise.resolve({errMsg: "Chat data not valid."})
}


/**
 * 
 * @param {*} room_id 
 * @param {*} limit 
 * @param {*} user_id 
 */

async function findChatsToLimit(room_id, limit=0, user_id){
  //-- setup the limit default value
  if(limit === 0 || limit === undefined){
    limit = 25;
  }

  let chats = await Chats.find({chat_room_id: room_id}).limit(limit).sort({createdAt: 'asc'});

  if(chats.length === 0){
    return Promise.resolve({chats: false});
  } else {
    return formatChat(user_id, chats);
  }
}

module.exports = {
  generateMessage,
  insertChat,
  findChatsToLimit
}