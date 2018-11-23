$(document).ready(function () {
  var socket = io('/xraytalk');
  var userID = $('#sid').val();
  var chatRoomId = null;

  

  //-------------------------------------------------------------
  //-------------------------------------------------------------
  //-------------------------------------------------------------
  //-- The XrayTalk App UI manager
  //-------------------------------------------------------------
  var Media_UI = (function () {
    var listObj = $('.list');
    var friendsListObj = $('#friends-list');
    var friendsListNavObj = $('#friends-list-nav');

    var findFriendsListObj = $('#find-friends-list');
    var findFriendsListNavObj = $('#find-friends-list-nav');

    var searchDataObj = $('#searchData');
    var searchResultObj = $('#searchResult');

    var newFriendObj = $('.newFriend');

    var chatPanelObj =  $('#chat-panel'); //-- selects the div where id=chat-panel
    var messageObj   =  $('#message');
    var sendMessageBtnObj = $('#sendMessage');
    var chatBoxObj   =  $('#chat-box');

    var chatRoomIdObj = $('#rid');

    return {
      listObj: listObj,
      
      friendsListObj: friendsListObj,
      friendsListNavObj: friendsListNavObj,

      findFriendsListObj: findFriendsListObj,
      findFriendsListNavObj: findFriendsListNavObj,

      searchDataObj: searchDataObj,
      searchResultObj: searchResultObj,

      newFriendObj: newFriendObj,

      chatPanelObj: chatPanelObj,
      messageObj: messageObj,
      chatBoxObj: chatBoxObj,
      sendMessageBtnObj: sendMessageBtnObj,
      chatRoomIdObj: chatRoomIdObj
    };
  })();





  //-------------------------------------------------------------
  //-------------------------------------------------------------
  //-------------------------------------------------------------
  //-- The Utility functions
  //-------------------------------------------------------------
  var Utils = (function () {


    //-- generates a message template
    function generateMessageTemplate(message, imgSrc, userType){
      var messageBox = document.createElement('div');

      if(message, imgSrc, userType){
        messageBox.setAttribute('class', 'message-box ' + userType);

      var messageTemplate ='<img src="%%src%%" class="chat-thumbnail"/>'+
                            '<div class="message">'+
                              '<span>%%message%%</span>'+
                            '</div>';
      messageTemplate = messageTemplate.replace(/\%\%src\%\%/, imgSrc);
      messageTemplate = messageTemplate.replace(/\%\%message\%\%/, message);

      messageBox.innerHTML = messageTemplate;
      } else {
        messageBox.setAttribute('class', 'message-box admin');
        var html = '<p class="no-message">Say hi to your friend.</p>';
        messageBox.innerHTML = html;
      }
      return messageBox;
    }



    //----------------------------------------------------------------------------
    //-- generates a search result template
    //----------------------------------------------------------------------------
    function generateSearchResultTemplate(searchResult, btnIndex) {
      var container = document.createElement('div');
      container.setAttribute('class', 'search-results');

      var html;

      if (searchResult) {
        html = '<a href="#%%userName%%" class="newFriend" id="newFriendBtn' + btnIndex + '">' +
          '<img src="%%IMGSRC%%" class="chat-thumbnail" />' +
          '<p class="user-name-text">%%userName%% </p>' +
          '</a>';
        html = html.replace(/%%IMGSRC%%/, searchResult.profilePics);
        html = html.replace(/%%userName%%/g, searchResult.userName);
      } else {
        html = '<p class="no-search-result">No User found.</p>';
      }

      container.innerHTML = html;

      return container;
    }

    
    //----------------------------------------------------------------------------
    //-- generates a template for friend list
    //----------------------------------------------------------------------------
    function generateFriendListTemplate(friendData, index) {
      var friendDataContainer = document.createElement('div');
      friendDataContainer.setAttribute('class', 'my-friends container');

      var html;
      if (friendData) {
        html = '<a href="#%%ROOMID%%" class="friend-link row" id="btnFriend-' + index + '">' +
          '<img src="%%FRIENDIMG%%" class="chat-thumbnail col-md-2" />' +
          '<p class="user-name-text col-md-8">%%userName%% </p>' +
          '</a>';
        html = html.replace(/%%ROOMID%%/, friendData.chat_room_id);
        html = html.replace(/%%FRIENDIMG%%/, friendData.profilePics);
        html = html.replace(/%%userName%%/, friendData.userName);
      } else {
        html = '<p class="no-friend">You have no friends yet</p>';
      }


      friendDataContainer.innerHTML = html;

      return friendDataContainer;
    }

    
    //----------------------------------------------------------------------------
    //-- generates a Template for search bar
    //----------------------------------------------------------------------------
    function generateSearchBar() {
      var container = document.createElement('div');
      container.setAttribute('class', 'friends-search');

      var html = '<input id="searchData" class="form-control" type="text" placeholder="Find new Friends by their Username"/>' +
        '<div id="searchResult"></div>';

      container.innerHTML = html;

      return container;
    }

    //----------------------------------------------------------------------------
    //-- generates a Template for chatting                                      --
    //----------------------------------------------------------------------------
    function generateChatTemplate(){
      var container = document.createElement('div');
      container.setAttribute('class', 'chat-box-panel');

      var html = '<div id="chat-panel"></div>' +
                 '<div class="container-fluid message-sender-panel col-md-6 mx-auto">'+
                 '<div class="row">'+
                   '<div class="col-sm-9">'+
                     '<input type="text" id="message" placeholder="Type Message" class="form-control" />'+
                   '</div>'+
                   '<div class="col-sm-2">'+
                     '<button class="btn btn-primary" id="sendMessage">Send</button>'+
                   '</div>'+
                 '</div>'+
               '</div>';
      container.innerHTML = html;

      return container;
    }
    return {
      generateFriendListTemplate: generateFriendListTemplate,
      generateSearchBar: generateSearchBar,
      generateSearchResultTemplate: generateSearchResultTemplate,
      generateChatTemplate: generateChatTemplate,
      generateMessageTemplate: generateMessageTemplate
    };
  })();




  //-------------------------------------------------------------
  //-------------------------------------------------------------
  //-------------------------------------------------------------
  //-- XrayTalkApp Controller
  //-------------------------------------------------------------
  var XrayTalkApp = (function (Media_UI, Utils) {
    //-------------------------------------------------------------
    //-- cleans up the UI
    //-------------------------------------------------------------
    function clearLists() {
      Media_UI.findFriendsListObj = Media_UI.findFriendsListObj.empty();
      Media_UI.friendsListObj = Media_UI.friendsListObj.empty();
      Media_UI.chatBoxObj = Media_UI.chatBoxObj.empty();
      Media_UI.listObj.hide();

      Media_UI.friendsListNavObj.removeClass('active-media-nav');
      Media_UI.findFriendsListNavObj.removeClass('active-media-nav');
    }

    //-------------------------------------------------------------
    //-- This setups up the friends list UI
    //-------------------------------------------------------------
    function setupFriendsList() {
      clearLists(); // clean UI
      Media_UI.listObj.show(200, "swing");

      if (!Media_UI.friendsListNavObj.hasClass('active-media-nav')) {
        Media_UI.friendsListNavObj.addClass('active-media-nav');
      }

      getFriends();
    }

    //-------------------------------------------------------------
    //-- function to be called if getFriends is successfull
    //-------------------------------------------------------------
    function updateFriendsList(friends) {
      Media_UI.friendsListObj = Media_UI.friendsListObj.empty();
      if (friends) { //-- this user has friend(s)
        for (var i = 0; i < friends.length; i++) { //-- loop through the data
          Media_UI.friendsListObj.append(Utils.generateFriendListTemplate(friends[i], i));
        }
      } else { //-- this user has no friend yet
        Media_UI.friendsListObj.append(Utils.generateFriendListTemplate());
      }

      configEvents();
    }

    function setupChatBox(chats){
      clearLists();
      

      Media_UI.chatBoxObj.append(Utils.generateChatTemplate());
      Media_UI.chatPanelObj = $('#chat-panel');
      Media_UI.messageObj   = $('#message');
      Media_UI.sendMessageBtnObj = $('#sendMessage');

      updateChatBox(chats);
      configEvents();
    }

    function updateChatBox(chats){
      if(chats instanceof Array && chats.length > 0){
        for(const chat of chats){
          var messageTemplate = Utils.generateMessageTemplate(chat.message, chat.profilePics, chat.userType);
          Media_UI.chatPanelObj.append(messageTemplate);
        }
      } else {
        var messageTemplate = Utils.generateMessageTemplate();
          Media_UI.chatPanelObj.append(messageTemplate);
      }
      
    }

    //-------------------------------------------------------------
    //-- This setups up the find friends list UI
    //-------------------------------------------------------------
    function setupFindFriendsList() {
      clearLists(); // clean UI
      Media_UI.listObj.show(200);

      Media_UI.findFriendsListObj.append(Utils.generateSearchBar());
      Media_UI.searchDataObj = $('#searchData'); //-- now exists add it up
      Media_UI.searchResultObj = $('#searchResult');

      if (!Media_UI.findFriendsListNavObj.hasClass('active-media-nav')) {
        Media_UI.findFriendsListNavObj.addClass('active-media-nav');
      }

      //-- call event config to register the newly added objects
      configEvents();
    }

    //-------------------------------------------------------------
    //-- function to be called if getUsers is successfull
    //-------------------------------------------------------------
    function updateSearchResultList(users) {
      Media_UI.searchResultObj = Media_UI.searchResultObj.empty();

      if (users) {

        //-- some users with the userName supplied where found
        for (var i = 0; i < users.length; i++) {
          Media_UI.searchResultObj.append(Utils.generateSearchResultTemplate(users[i], i));
        }
      } else { //-- no user with the supplied user name
        Media_UI.searchResultObj.append(Utils.generateSearchResultTemplate());
      }

      //-- reAdd this UI object
      Media_UI.newFriendObj = $('.newFriend');
      //-- reconfig the events
      configEvents();

    }

    //-------------------------------------------------------------
    //-- sends an async requests to the server for friends data
    //-------------------------------------------------------------
    function getFriends() {
      $.ajax('/user/getfriends/', {
        success: updateFriendsList,
        async: true,
        method: 'post',
        error: errorHandler
      }
      );
    }


    //-------------------------------------------------------------
    //-- sends an async requests to the server for users data
    //-------------------------------------------------------------
    function getUsers() {
      var data = Media_UI.searchDataObj.val();
      if (data !== '') {
        $.ajax('/user/getUsers/', {
          success: updateSearchResultList,
          async: true,
          method: 'post',
          data: 'userName=' + data,
          error: errorHandler
        }
        );
      } else {
        Media_UI.searchResultObj = Media_UI.searchResultObj.empty(); //-- clean
      }

    }

    //---------------------------------------------------------------------
    //-- send an async request to server to add new Friend
    //---------------------------------------------------------------------
    function addFriend(friendUserName) {
      $.ajax('/user/addFriend/', {
        success: setupFindFriendsList,
        async: true,
        method: 'post',
        data: 'friendUserName=' + friendUserName,
        error: errorHandler
      }
      );
    }

    //---------------------------------------------------------------------
    //-- Send an async request to server to retrieve chats
    function getChats(chatRoomId){
      $.ajax('/user/getChats/', {
        success: setupChatBox,
        async: true,
        method: 'post',
        data: 'roomId=' + chatRoomId,
        error: errorHandler
      }
      );

      socket.emit('privateChat',chatRoomId, function(err){
        if(err){
          //-- use a display box to show output
          console.log(err);
        }
      });
    }

    //---------------------------------------------------------------------
    //-- function to be called handle errors
    //---------------------------------------------------------------------
    function errorHandler(err) {
      console.log(err);
    }


    //---------------------------------------------------------------------
    //-- setup the event handlers
    //---------------------------------------------------------------------
    function configEvents() {
      Media_UI.friendsListNavObj.on('click', setupFriendsList);

      Media_UI.findFriendsListNavObj.on('click', setupFindFriendsList);

      Media_UI.searchDataObj.on('keyup', getUsers);

      for (i = 0; i < Media_UI.newFriendObj.length; i++) {
        $('#newFriendBtn' + i).on('click', function (e) {
          addFriend(e.currentTarget.getAttribute('href').replace('#', ''));
        });
      }

      var friendsLinkObj = $('.friend-link');
      for (i = 0; i < friendsLinkObj.length; i++) {
        $('#btnFriend-' + i).on('click', function (e) {
          getChats(e.currentTarget.getAttribute('href').replace('#', ''));
          Media_UI.chatRoomIdObj.val(e.currentTarget.getAttribute('href').replace('#', ''));
        });
      }

          //-- Send a message
      Media_UI.sendMessageBtnObj.on('click', function(){
        var message = Media_UI.messageObj;
        var chatRoomId = Media_UI.chatRoomIdObj.val();

        console.log(message.val())

        if(message.val() !== ""){ //-- message is not empty

          socket.emit('createMessage', {message: message.val(), userID: userID, chatRoomId: chatRoomId}, function(){
            message = message.val(); // clear the message field
          });

        }
      });
    }

    
    //---------------------------------------------------------------------
    //-- On page load get the user friends
    getFriends();


    return {
      configEvents: configEvents
    }
  })(Media_UI, Utils);

  
  socket.on('connect', function(){
    console.log('connected');

    // socket.emit('privateChat',chatRoomId, function(err){
    //   if(err){
    //     //-- use a display box to show output
    //     console.log(err);
    //   }
    // });
  });


  socket.on('newMessage', function(message){
    for(const chat of message){
      if(chat.uid === userID){
        chat.userType = "user";
      } else {
        chat.userType = "friend";
      }

      var messageTemplate = Utils.generateMessageTemplate(chat.message, chat.profilePics, chat.userType);
      Media_UI.chatPanelObj = $('#chat-panel');
      Media_UI.chatPanelObj.append(messageTemplate);
    }
    scrollToBottom();
  });
  
  socket.on('disconnect', function(){
    alert('Connection to server lost');
  });

  function scrollToBottom() {
    // Selectors
    var messages =Media_UI.chatPanelObj;
    var newMessage = messages.children('div:last-child');
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}
  //-------------------------------------------------------------
  //-- setup app.
  XrayTalkApp.configEvents();
});