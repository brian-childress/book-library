// Connect to Apigee sandbox
var apigee = new Usergrid.Client({
    orgName:'brianc',
    appName:'sandbox'
});

$(document).ready(function () {

  $('#post-message').bind('click', postMessage);
  
  refreshFeed();

  function refreshFeed() {
    //a new Collection object that will be used to hold the full feed list
    var my_books = new Usergrid.Collection({ "client":apigee, "type":"books" });
    //make sure messages are pulled back in order
    my_books.fetch(
      
      // Success Callback
      function(){
        var html = "";
        while(my_books.hasNextEntity()) {
          var current_book = my_books.getNextEntity();

          html += '<li>';
          html += '<h3>' + current_book.get('title') +'</h3>';
          html += '<p>'+ current_book.get('author') +'</p>';
          html += '</li>';
        }
        $("#messages-list").html(html);
        $('#messages-list').listview('refresh');
      },
      
      // Failure Callback
      function(){
        $("#messages-list").html("<li>There was an error getting the messages!</li>");
      }
    );
  }

  function postMessage() {

    content = $("#content").val();

    options = { "type":"books",
                "title":content };

    apigee.createEntity(options, function (error, response) {
        if (error) {
            alert('Could not post');
        } else {
          refreshFeed();
          history.back(); // or: window.location = "#page-messages-list";
        }
    }); //apigee.createEntity
  } //postMessage
}); //document ready