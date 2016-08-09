// YOUR CODE HERE:
//Event handler change for roomselect
//put it on fetch.



var username = '';
var newestDate = {
  'lobby': 0
};
var app = {
  init: function () {
    $('.submit').on('submit', app.handleSubmit);
    console.log('fetching')
    app.fetch();
  },
  send: function (data) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data)
    });
  },
  fetch: function () {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages/',
      datatype: 'json',
      success: function (obj) {
        var currentRoom = $('#roomSelect').val();
        var roomMessages = obj.results.filter((msgObj) => {
          // adds new room name to room select
          if (!newestDate.hasOwnProperty(msgObj.roomname)) {
            $('#roomSelect').append('<option value="' + msgObj.roomname + '">' + msgObj.roomname + '</option>');
            newestDate[msgObj.roomname] = Date.parse(msgObj.createdAt);
          }
          return msgObj.roomname === currentRoom;
        });
        var time = Date.parse(roomMessages[0].createdAt);
        console.log(time, newestDate[currentRoom]);
        if (time > newestDate[currentRoom]) {
          roomMessages.filter((msgObj) => Date.parse(msgObj.createdAt) > newestDate[currentRoom]).forEach(app.addMessage);
          newestDate[currentRoom] = Date.parse(obj.results[0].createdAt);
        }

      //   var time = Date.parse(obj.results[0].createdAt);
      //   if (time > newestDate) {
      //     obj.results.filter((msgObj) => Date.parse(msgObj.createdAt) > newestDate).forEach(app.addMessage);
      //     newestDate = time;
      //   }
      }
    });
  },
  clearMessages: function () {
    $('#chats').empty();
  },
  addMessage: function (message) {
    var saferMessage = {};
    _.each(message, (item, key) => {
      saferMessage[key] = _.escape(item);
    });
    var $message = $('<div class="chat"><span class="username">' + saferMessage.username + ': </span>' + saferMessage.text + '</div>');
    $message.click(app.addFriend);
    if (newestDate[$('#roomSelect').val()] === 0) {
      $('#chats').append($message);
    } else {
      $('#chats').prepend($message);
    }
  },
  addRoom: function (roomName) {
    $('#roomSelect').append('<' + roomName + '></' + roomName + '>');
  },
  addFriend: function () {},
  handleSubmit: function () {
    app.send({
      username: username,
      text: $('#message').val(),
      roomname: 'lobby'
    });
  }

};
$(function() {
  app.init();
  username = window.location.href.slice(window.location.href.indexOf('username=') + 9);
  username = decodeURIComponent(username);
});


// setInterval(() => {
//   app.fetch();
// }, 1000);
