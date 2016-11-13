//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var request = require('request');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var API_URL = "https://threadible-akc.c9users.io/api/";

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var app = express();
var router = require("./router");
router.createRoutes(app);
var server = http.createServer(app);
var io = socketio.listen(server);

/*
List of cells in the current workspace.
Each cell consists of a cell id (cell.id), authoring user id (cell.userid), code snippet (cell.code), and an output object (cell.output).
*/
var cells = [];
var sockets = [];

io.on('connection', function (socket) {
  cells.forEach(function (cell) {
    socket.emit('eval_cell_output', cell);
  });

  sockets.push(socket);

  socket.on('disconnect', function () {
    sockets.splice(sockets.indexOf(socket), 1);
  });
  
  //FIXME
  socket.on('cell_edit', function (msg) {
    broadcast('cell_edit', msg);
  });
  
  socket.on("cell_highlight", function (msg) {
    broadcast("cell_highlight", msg);
  });
  
  /*
  Cell input received from a user. Note that cell.output at this point is null; output is determined by first sending the cell to
  the API server and waiting for the response. After response is received, broadcast new cell with added output to all users.
  */
  socket.on('eval_cell_input', function (new_cell) {
    var code = String(new_cell.code || '');
    if (!code)
      return;
    /*
    request.post(
        API_URL + "cells/edit",
        { json: { workspace_id: 1, code: new_cell.code } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    );
    */
    new_cell.output = {
      type: "terminal",
      data: "This cell passed through the node server. yay!"
    };
      
    broadcast("eval_cell_output", new_cell);
    cells.push(new_cell);
  });
});

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
