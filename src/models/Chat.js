/* Chat.js
 * This defines the schema for Chat
 * It stores the chat between friends, each chat contains chat_room_id which is
 * used for easy retrieval of chats
 * Developer: Iwuji Jude
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  chat_room_id: {
    type: String,
    required: true
  }
  ,
  message: {
    type:String,
    required: true
  }
  ,
  mimeType: {
    type:String,
    required: true
  }
  ,
  createdAt: {
    type:Date,
    default: Date.now
  }
  ,
  user_id: {
    type: String,
    required: true
  }
});

mongoose.model("chats", ChatSchema);