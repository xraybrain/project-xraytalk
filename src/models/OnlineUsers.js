/* Filename: OnlineUsers.js
 * Developer: Iwuji Jude
 * Decription: This defines the schema for the Users that are online
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newOnlineUsersSchema = new Schema({
  user_id: {
    type: String,
    required: true
  }
  ,
  date: {
    type: Date,
    required: true
  }
});

mongoose.model('onlineusers', newOnlineUsersSchema);