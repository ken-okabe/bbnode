/* jshint node: true */
/* jshint sub: true */

'use strict';
/*global window, $,alert*/

var log = function(msg)
{
  console.log(msg);
};
log('init5');

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

      /*
      socket.emit('msg', 'data',
        function(data)
        {
          log(data);
        }
       );*/

    })
    .on('reconnect', function()
    {
      log('socket reconnected');

    })
    .on('msg', function(msg, f)
    {
      log(msg);
      if (msg.cmd === 'ready')
      {
        log('server module for this socket ready');
        //==================================
        socket.emit('msg',
          {
            cmd: 'socketid',
            sub: null,
            data: null
          },
          function() {}
        );

        socket.emit('msg',
          {
            cmd: '@test',
            sub: 'hi',
            data: 'heloooooooo'
          },
          function(data)
          {
            log(data);
          });
        //======================================
      }

    });

});
