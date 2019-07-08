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

  var chatPanelObj = $('#chat-panel'); //-- selects the div where id=chat-panel
  var messageObj = $('#message');
  var sendMessageBtnObj = $('#sendMessage');
  var chatBoxObj = $('#chat-box');

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
