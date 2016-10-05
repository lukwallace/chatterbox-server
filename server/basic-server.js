/* Import node's http module: */
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');

var handleRequest = require('./request-handler');

// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.
var port = 3000;

var ip = '127.0.0.1';

// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//
// After creating the server, we will tell it to listen on the given port and IP. */

//Node server implementation
// var server = http.createServer(handleRequest.requestHandler);
// console.log('Listening on http://' + ip + ':' + port);
// server.listen(port, ip);

//Store all messages
var messages = [];

//Keep messages in chronological order
var counter = 0;

//Express Static File
app.use(express.static(path.join(__dirname, 'public')));

//Body-Parser Module
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//GET
app.get('/classes/messages', function(req, res) {
  var data = {results: []};
  messages.forEach(function (jsonObj) {
    data.results.push(jsonObj);
  });
  data.results = data.results.reverse();
  res.send(data);
});

//POST
app.post('/classes/messages', function (req, res) {
  counter++;
  var datum = {
    objectId: counter,
    username: req.body.username,
    text: req.body.text,
    roomname: req.body.roomname
  };
  messages.push(datum);
  res.status(201).send('I got sometihng');
});

app.listen(3000);
