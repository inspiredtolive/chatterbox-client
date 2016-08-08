// YOUR CODE HERE:
var messages = [];
$.ajax('https://api.parse.com/1/classes/messages', {
  datatype: 'json',
  complete: function (obj, status) {
    messages = obj.responseJSON.results;
    console.log(messages);
  }
});
