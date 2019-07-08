//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-- The Utility functions
//-------------------------------------------------------------
var Utils = (function () {


  //-- generates a message template
  function generateMessageTemplate(message, imgSrc, userType) {
    var messageBox = document.createElement('div');

    if (message, imgSrc, userType) {
      messageBox.setAttribute('class', 'message-box ' + userType);

      var messageTemplate = '<img src="%%src%%" class="chat-thumbnail"/>' +
        '<div class="message">' +
        '<span>%%message%%</span>' +
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
  function generateChatTemplate() {
    var container = document.createElement('div');
    container.setAttribute('class', 'chat-box-panel');

    var html = '<div id="chat-panel"></div>' +
      '<div class="container-fluid message-sender-panel col-md-6 mx-auto">' +
      '<div class="row">' +
      '<div class="col-sm-9">' +
      '<input type="text" id="message" placeholder="Type Message" class="form-control" />' +
      '</div>' +
      '<div class="col-sm-2">' +
      '<button class="btn btn-primary" id="sendMessage">Send</button>' +
      '</div>' +
      '</div>' +
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