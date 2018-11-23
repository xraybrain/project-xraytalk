/* ChatRoom.js
 * This defines the schema for Chat Room
 * it stores the friends room_id which will be used by app to initiate chats and
 * to retrieve previous chats.
 * Developer: Iwuji Jude
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
  room_id: {
    type: String,
    required: true
  }
});

mongoose.model("chatrooms", ChatRoomSchema);