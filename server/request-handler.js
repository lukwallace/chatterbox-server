var fs = require('fs');
var lr = require('readline');

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var counter = 1;
var messages = [];

fs.appendFileSync('messages.txt', '');
fs.readFileSync('messages.txt').toString().split('\n').forEach(function (line) {
  if (line) {
    messages.push(JSON.parse(line));
  }
});

var requestHandler = function(request, response) {
// Request and Response come from node's http module.


  // The outgoing status.
  var statusCode;
  if ( !request.url.includes('/classes/messages') ) {
    statusCode = 404;
  } else if ( request.method === 'POST' ) {
    statusCode = 201;
  } else if ( request.method === 'GET' || request.method === 'OPTIONS' ) {
    statusCode = 200;
  } else {
    statusCode = 404;
  }

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'application/json';

  response.writeHead(statusCode, headers);

  var data = {
    method: request.method,
    url: request.url,
    results: []
  };

  //POST
  if (request.method === 'POST') {
    var body = '';
    request.on('data', function(chunk) {
      body += chunk.toString();
    });

    request.on('end', function() {
      var obj = JSON.parse(body);
      counter++;
      obj.objectId = counter;
      messages.push(obj);

      fs.appendFileSync('messages.txt', JSON.stringify(obj) + '\r\n', 'utf8', function(err) {
        if (err) {
          console.error(err);
          throw err;
        }
      });

      response.end(JSON.stringify(data));
    });

  //GET
  } else {
    messages.reverse().forEach(function (jsonObj) {
      data.results.push(jsonObj);
    });

    response.end(JSON.stringify(data));
  }
};

exports.requestHandler = requestHandler;

