

$(document).ready(function(){
  var source = new EventSource('/room/1/message');

  source.onopen = function() {
    console.log('SSE connection open!');
  };
  source.onclose = function() {
    console.log('SSE connection closed!');
  };
  source.onerror = function(error) {
    console.log('SSE error detected:');
    console.log(error);
  };
  source.onmessage = function(message) {
    console.log('SSE onmessage detected:');
    $("#message-box ul").append('<li class="list-group-item">'+message.data+'</li>');
  }; 

  $("#submit").click(function(){
    $.post('/room/1/message', {message: $("#message").val()}, function(){
      $("#message").val('');
    });
  }) 
});
