var fs = require('fs');
var lr = require('readline');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
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

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.

  // The outgoing status.
  var statusCode;
  if ( !request.url.includes('/classes/messages') ) {
    statusCode = 404;
  } else if ( request.method === 'POST' ) {
    statusCode = 201;
  } else if ( request.method === 'GET' ) {
    statusCode = 200;
  } else {
    statusCode = 405;
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
    //Still getting data from client
    request.on('data', function(chunk) {
      body += chunk.toString();
    });
    statusCode = request.method === 'PUT' ? 405 : 404;

    request.on('end', function() {
      var obj = JSON.parse(body);
      counter++;
      obj.objectId = counter;
      messages.push(obj);

      // fs.appendFileSync('messages.txt', obj + '\r\n', 'utf8', function(err) {
      //   if (err) {
      //     console.error(err);
      //     throw err;
      //   }
      // });
      response.end(JSON.stringify(data));
    });

  //GET
  } else {
    messages.forEach(function (jsonObj) {
      data.results.push(jsonObj);
    });
    // fs.readFileSync('messages.txt').toString().split('\n').forEach(function (line) {
    //   if (line) {
    //     data.results.push(JSON.parse(line));
    //   }
    // });

    response.end(JSON.stringify(data));
  }
};


//module.exports = requestHandler;
exports.requestHandler = requestHandler;

