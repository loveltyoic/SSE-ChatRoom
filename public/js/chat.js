

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
    $("#message-box ul").prepend(template(message.data));
  }; 

  var template = function(message) {
    var date = new Date();
    var time = date.toLocaleString(); 
    return '<li class="media"><div class="media-body"><h4 class="media-heading">'+time+'</h4>'+message+'</div></li>';
  }

  $("#submit").click(function(){
    $.post('/room/1/message', {message: $("#message").val()}, function(){
      $("#message").val('');
    });
  }) 
});
