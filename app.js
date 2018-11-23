/**
 * module dependencies
 */
const path = require("path");
const http = require("http");
const express  = require("express");
const expresshbs = require("express-handlebars");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const favicon  = require('serve-favicon');


//-- Load the Database config
const {mongoURI} = require('./src/config/database');


//-- Load Passport config
require('./src/config/passport')(passport);

//-- Connect to mongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true
})
 .then(()=>{
  console.log("+----------------------+");
  console.log(`| Connected to mongoDB |`)
  console.log("+----------------------+");
 })
 .catch(message => {
   console.log(message);
 });


//-- setup application
const app = express();


//-- set the public directory
const publicDir = path.join(__dirname,"/public");
app.use(express.static(publicDir));


//-- Load the user route
const user = require('./src/routes/user');

//-- Load chat model
require('./src/models/Chat');
const Chats =  mongoose.model('chats');

//-- Load the User model
require('./src/models/User');
const Users = mongoose.model('users');

//-- create the server
const server = http.createServer(app);

/**
 * The app middlewares
 */

//-- bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//-- express-session middleware
app.use(session({resave:true, secret: "xrayTalkOnWeb001", saveUninitialized: true}));

//-- connect-flash middleware
app.use(connectFlash());

//-- serve-favicon middleware
app.use(favicon(path.join(__dirname , 'public', 'core', 'favicon', 'favicon.ico')));

//-- Constant data used by the handlebars
const viewsPath = path.join(__dirname,'src/views');
const layoutsPath = path.join(viewsPath, 'layouts');
const partialsPath = path.join(viewsPath, 'partials');

//-- express-handlebars middleware
app.engine('handlebars', expresshbs({defaultLayout: 'main', layoutsDir: layoutsPath, partialsDir:  partialsPath}));
app.set('view engine', 'handlebars');
app.set('views', viewsPath);


//-- passport middleware
app.use(passport.initialize());
app.use(passport.session());


//-- initialize socketIO
/*
 * this is used for the client-server communication (chatting)
 */
const io = socketIO(server);
const xrayTalkIO = io.of('/xraytalk'); //-- create a namespace

const {generateMessage, insertChat, findChatsToLimit} = require('./src/lib/chat/Chat');
xrayTalkIO.on('connection', (socket)=>{
  console.log('User connected');

  socket.on('privateChat', (chat_room_id, callback) => {
    
    if(chat_room_id === null || chat_room_id === undefined){
      callback(true);
    } else {
      //-- join the room
      socket.join(chat_room_id);
    }
    callback(false); //-- chat setup successfully
  });

  //-- Listen to user createMessage
  socket.on('createMessage', (messageData, callback) => {
    let userID = messageData.userID;
    let message = messageData.message;
    let chat_room_id = messageData.chatRoomId;

    let newMessage = generateMessage(userID, message, chat_room_id);
    if(newMessage !== {} || newMessage !== null){
      insertChat(newMessage)
       .then(chat => {
          //-- event emitted so user and friend can see the message
          xrayTalkIO.to(chat_room_id).emit('newMessage', chat);
       })
       .catch(err => {
         console.log(err);
       });
    }else {
      callback("It seems like you sent an empty message");
      return;
    }
    callback();
  });
});


/**
 * App local variables
 */
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;

  next();
});


//-- Render the home page
app.get('/', (req, res)=>{
  
  if(req.isAuthenticated()){
    let profilePics = req.user.pictureDir || '/core/img/user.png';
    res.render('user/index', {
      pageTitle: "XrayTalk | " + req.user.userName,
      user: req.user,
      profilePics
    });
  } else {
    res.render('guest/index', {
      pageTitle: "XrayTalk"
    });
  }
});

//-- Use the user route
app.use('/user', user);

//-- load the PORT from environment variable or default PORT (3000)
const port = process.env.PORT || 3000;


//-- Start up the server
server.listen(port, () => {
  //-- Console server state
  console.log("+-----------------------------+");
  console.log(`| Server is up on port [${port}] |`)
  console.log("+-----------------------------+");
});