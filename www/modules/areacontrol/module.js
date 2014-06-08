/* jshint node: true */
/* jshint sub: true */
'use strict';

var moduleID = '@areacontrol';

var log = function(msg)
{
  var util = require('util');
  process.stdout.write(moduleID + ': ');
  process.stdout.write(util.inspect(msg,
  {
    depth: 99,
    colors: true
  }));
  process.stdout.write('\n');
};

var g = global;
log(g.d);

var init = function()
{
  log('init');

  var _ = require('lazy.js');

  var WebSocket = require('ws');
  var WebSocketStream = require('WebSocketStreamPlus');

  var rpc = require('rpc-streamx');

  var dbServerURL = 'http://localhost:3001';
  var ws = new WebSocket(dbServerURL);
  var c = new WebSocketStream(ws);

  var db = rpc();
  c
    .pipe(db)
    .pipe(c)
    .on('close', function()
    {
      ws.close();
      console.log('peer dbHolder Server c close');

    })
    .on('error', function()
    {
      ws.close();
      console.log('peer dbHolder Server c error');

    })
    .on('finish', function()
    {
      ws.close();
      console.log('peer dbHolder Server c finish');

    });

  db
    .rpc('set',
      {
        index: [],
        val: 3
      },
      function(msg)
      {
        console.log(msg);
      });

  db
    .rpc('create',
      {
        index: []
      },
      function(msg)
      {
        console.log(msg);
      });

  db
    .rpc('createS',
      {
        index: []
      },
      function(msg)
      {
        console.log(msg);
      });

  db
    .rpc('add',
      {
        index: [],
        val: 3
      },
      function(msg)
      {
        console.log(msg);
      });

};

init();


module.exports = {
  //on connect or reconnect
  socket: function(socket)
  {
    log(socket.id);


    socket
      .on('msg',
        function(msg, f)
        {
          if (msg.cmd === moduleID)
          {
            log(msg);
            if (msg.sub === 'category')
            {
              f(g.d['forumconfig'].category);
            }
          }
        });
  }

};
