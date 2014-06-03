/* jshint node: true */
/* jshint sub: true */

'use strict';
/*global window, $,alert*/

var log = function(msg)
{
  console.log(msg);
};
log('init');

$('document').ready(function()
{
  var io = require('socket.io-client');

  var socket = io.connect(window.location.hostname,
  {
    'reconnect': true,
    'reconnection delay': 500,
    'max reconnection attempts': 10
  });
  socket
    .on('connect', function()
    {
      log('socket connected');


    }).on('reconnect', function()
    {
      log('socket reconnected');


    });

});
