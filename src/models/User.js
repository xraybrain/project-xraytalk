/* Filename: User.js
 * Developer: Iwuji Jude
 * Decription: This defines the schema for the app User
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  
  userName: {
    type: String,
    required: true
  }
  ,
  emailAddress: {
    type: String,
    required: true
  }
  ,
  password: {
    type: String,
    required: true
  }
  ,
  status: {
    type: String,
    default: "Hey, am on XrayTalk! let's chat!"
  }
  ,
  pictureDir: {
    type: String,
    default: ""
  }
});

mongoose.model("users", UserSchema);