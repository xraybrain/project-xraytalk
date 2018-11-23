/* Friend.js
 * This defines the schema for User Friend
 * Developer: Iwuji Jude
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
  user_id: {
    type: String,
    required: true
  }
  ,
  friend_id: {
    type: String,
    required: true
  }
  ,
  room_id: {
    type: String,
    required: true
  }
});

mongoose.model("friends", FriendSchema);