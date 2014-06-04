/* jshint node: true */
/* jshint sub: true */

'use strict';
/*global window, $,alert*/

var log = function(msg)
{
  console.log('CORE:', msg);
};
log('init5');

$('document').ready(function()
{
  var modules = [];
  modules['test'] = require('../modules/test/www/client_module.js');



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
      if (msg.cmd === 'module')
      {
        log('loading module @' + msg.data);
        modules[msg.data].socket(socket);
      }


      if (msg.cmd === 'ready')
      {
        log('server modules for this socket ready');
        //==================================
        socket.emit('msg',
          {
            cmd: 'socketid',
            sub: null,
            data: null
          },
          function(socketid)
          {
            log(socketid);
          }
        );


        //======================================
      }

    });

});
