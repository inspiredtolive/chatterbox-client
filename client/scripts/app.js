// YOUR CODE HERE:
//Event handler change for roomselect
//put it on fetch.



var username = '';
var newestDate = {
  'lobby': 0
};
var users = {};
var friends = [];
var app = {
  url: 'https://api.parse.com/1/classes/messages',
  init: function () {
    console.log('initializing');
    $('.submit').on('submit', app.handleSubmit);
    $('#roomSelect').on('change', () => {
      _.each(newestDate, (item, key) => {
        newestDate[key] = 0;
      });
      app.clearMessages();
      app.fetch();
      console.log('changing rooms!');
    });
    app.fetch();
  },
  send: function (data) {
    $.ajax({
      url: this.url,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data)
    });
  },
  fetch: function (data) {
    $.ajax({
      url: this.url,
      datatype: 'json',
      success: function (obj) {
        var currentRoom = $('#roomSelect').val();

        // filters the message room name
        // add new rooms to roomSelect
        // adds most recent date to newestDate Obj
        var roomMessages = obj.results.filter((msgObj) => {
          if (msgObj.roomname && !newestDate.hasOwnProperty(msgObj.roomname)) {
            $('#roomSelect').append('<option value="' + msgObj.roomname + '">' + msgObj.roomname + '</option>');
            newestDate[msgObj.roomname] = 0;
          }
          return msgObj.roomname === currentRoom;
        });

        // add messages 
        var time = Date.parse(roomMessages[0].createdAt);
        console.log(time, newestDate[currentRoom], newestDate, currentRoom);
        if (time > newestDate[currentRoom]) {
          roomMessages.filter((msgObj) => Date.parse(msgObj.createdAt) > newestDate[currentRoom]).forEach(app.addMessage);
          newestDate[currentRoom] = Date.parse(obj.results[0].createdAt);
        }

        friends.forEach((friend) => {
          var user = users[friend];
          console.log(user);
          $('.' + user).parents('.chat').addClass('friend');
        });
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
    if (!users.hasOwnProperty(saferMessage.username)) {
      users[saferMessage.username] = 'user' + Object.keys(users).length;
    }
    var $message = $('<div class="chat"><span class="username ' + users[saferMessage.username] + '">' + saferMessage.username + '</span>: ' + saferMessage.text + '</div>');
    $message.children().click(app.addFriend);
    if (newestDate[$('#roomSelect').val()] === 0) {
      $('#chats').append($message);
    } else {
      $('#chats').prepend($message);
    }
  },
  addRoom: function (roomName) {
    $('#roomSelect').append('<' + roomName + '></' + roomName + '>');
  },
  addFriend: function () {
    var username = $(this).text();
    var user = users[username];
    if (friends.indexOf(username) === -1) {
      friends.push(username);
    }
    $('.' + user).parents('.chat').addClass('friend');
  },
  handleSubmit: function (e) {
    e.preventDefault();
    app.send({
      username: username,
      text: $('#message').val(),
      roomname: $('#roomSelect').val()
    });
    $('#message').val('');
    app.fetch();
  }

};
$(function() {
  app.init();
  username = window.location.href.slice(window.location.href.indexOf('username=') + 9);
  username = decodeURIComponent(username);
});


setInterval(() => {
  console.log($('#roomSelect').val());
  app.fetch();
}, 10000);
