/* jshint node: true */
/* jshint sub: true */

'use strict';

// this server can be remote from db1-app (3001,5000)

var port = 3000; //IDkey checker

var log = function(msg)
{
  var util = require('util');
  console.log(util.inspect(msg,
  {
    depth: 99,
    colors: true
  }));
};


log('dbHolderBase Server Started ' + port);

var WebSocket = require('ws');
var WebSocketStream = require('WebSocketStreamPlus');

var db = {};

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('db clone http://URL:port? ');
rl.prompt();

rl.on('line', function(line)
{
  rl.close();
  var val = line.trim();
  log(val);
  if (val !== '')
  {
    var dbServerURL = val;

    try
    {
      var ws = new WebSocket(dbServerURL);
      var c = new WebSocketStream(ws);

      var rpc = require('rpc-streamx');
      var dDB = rpc();

      c
        .pipe(dDB)
        .pipe(c)
        .on('close', function()
        {
          ws.close();
          log('dbHolderBase Server c close');

        })
        .on('error', function()
        {
          ws.close();
          log('dbHolderBase Server c error');
          process.exit(1);
        })
        .on('finish', function()
        {
          ws.close();
          log('dbHolderBase Server c finish');

        });

      dDB.rpc('cloneDB',
        true,
        function(db0)
        {
          log(db0);
          db = db0;

          log('Started with cloned DB');
          main();
        });

    }
    catch (e)
    {
      process.exit(1);
    }
  }
  else
  {
    log('Started with clean DB');
    main();
  }

});

var main = function()
{


  //=================================
  var dbHolderBase =
    new WebSocket
    .Server(
    {
      port: port
    })
    .on('connection',
      function(ws)
      {
        log('====dbHolderBase====');
        var c = new WebSocketStream(ws);
        var rpc = require('rpc-streamx');

        c
          .pipe(
            rpc(
            {
              /*   setDbUser: function(obj, f)
              {
                DB1.user[obj.id] = obj.user;
              },
              setDbIndexEmail: function(obj, f)
              {
                DB1.indexEmail[obj.email] = obj.id;
              }, */
              cloneDB: function(val, f)
              {
                f(db);
              }
            }))
          .pipe(c)
          .on('close', function()
          {
            ws.close();
            log('c close');

          })
          .on('error', function()
          {
            ws.close();
            log('c error');
          })
          .on('finish', function()
          {
            ws.close();
            log('DBHolderBase  stream finished');

          });
      });
  //=================================
};
