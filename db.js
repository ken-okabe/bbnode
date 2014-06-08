/* jshint node: true */
/* jshint sub: true */

'use strict';
// this server(db) is on the same machine of app(5000)

var port = 3001; //active db

//BaseDB server(app0) URL
var dbServerURL = 'http://localhost:3000';

var log = function(msg)
{
  var util = require('util');
  console.log(util.inspect(msg,
  {
    depth: 99,
    colors: true
  }));
};

log('peerDBHolderServer Started ' + port);

var _ = require('lazy.js');

var WebSocket = require('ws');
var WebSocketStream = require('WebSocketStreamPlus');

var db = [];;

var rpc = require('rpc-streamx');

var ws;
var c;

var dDB;

var connectDBbase = function()
{
  var reConnect = function()
  {
    log('reconnecting to baseDB after 1000ms');
    setTimeout(connectDBbase, 1000);
  };

  ws = new WebSocket(dbServerURL);
  c = new WebSocketStream(ws);

  dDB = rpc();
  c
    .pipe(dDB)
    .pipe(c)
    .on('close', function()
    {
      ws.close();
      console.log('peer dbHolder Server c close');
      reConnect();
    })
    .on('error', function()
    {
      ws.close();
      console.log('peer dbHolder Server c error');
      reConnect();
    })
    .on('finish', function()
    {
      ws.close();
      console.log('peer dbHolder Server c finish');
      reConnect();
    });

  return true;

};


if (connectDBbase())
{
  dDB
    .rpc('cloneDB',
      true,
      function(db0)
      {
        log(db0);
        db = db0;

        log('Started with the base DB');

        var main = function()
        {
          var dbHolder =
            new WebSocket.Server(
            {
              port: port
            })
            .on('connection',
              function(ws)
              {
                console.log('====dbHolder====');
                var c = new WebSocketStream(ws);
                var rpc = require('rpc-stream');

                c
                  .pipe(
                    rpc(
                    {
                      cloneDB: function(val, f)
                      {
                        f(db);
                      },
                      set: function(obj, f)
                      {
                        var index = obj.index;
                        var len = index.length;
                        if (len === 1)
                        {
                          db[index[0]] = obj.val;
                        }
                        else if (len === 2)
                        {
                          db[index[0]][index[1]] = obj.val;
                        }
                        else if (len === 3)
                        {
                          db[index[0]][index[1]][index[2]] = obj.val;
                        }
                        else if (len === 4)
                        {
                          db[index[0]][index[1]][index[2]][index[3]] = obj.val;
                        }
                        else if (len === 5)
                        {
                          db[index[0]][index[1]][index[2]][index[3]][index[4]] = obj.val;
                        }
                      },
                      create: function(obj, f)
                      {
                        var index = obj.index;
                        var len = index.length;
                        if (len === 1)
                        {
                          db[index[0]] = [];
                        }
                        else if (len === 2)
                        {
                          db[index[0]][index[1]] = [];
                        }
                        else if (len === 3)
                        {
                          db[index[0]][index[1]][index[2]] = [];
                        }
                        else if (len === 4)
                        {
                          db[index[0]][index[1]][index[2]][index[3]] = [];
                        }
                        else if (len === 5)
                        {
                          db[index[0]][index[1]][index[2]][index[3]][index[4]] = [];
                        }
                      },
                      createS: function(obj, f)
                      {
                        var index = obj.index;
                        var len = index.length;
                        if (len === 1)
                        {
                          db[index[0]] = _([]);
                        }
                        else if (len === 2)
                        {
                          db[index[0]][index[1]] = _([]);
                        }
                        else if (len === 3)
                        {
                          db[index[0]][index[1]][index[2]] = _([]);
                        }
                        else if (len === 4)
                        {
                          db[index[0]][index[1]][index[2]][index[3]] = _([]);
                        }
                        else if (len === 5)
                        {
                          db[index[0]][index[1]][index[2]][index[3]][index[4]] = _([]);
                        }
                      },
                      add: function(obj, f)
                      {
                        var index = obj.index;
                        var len = index.length;
                        if (len === 1)
                        {
                          if (db[index[0]] === 's')
                            db[index[0]] = db[index[0]].concat([obj.val]);
                          else
                            db[index[0]][db[index[0]].length] = obj.val;
                        }
                        else if (len === 2)
                        {
                          if (db[index[0]] === 's')
                            db[index[0]][index[1]] = db[index[0]][index[1]].concat([obj.val]);
                          else
                            db[index[0]][index[1]][db[index[0]][index[1]].length] = obj.val;
                        }
                        else if (len === 3)
                        {
                          if (db[index[0]] === 's')
                            db[index[0]][index[1]][index[2]] = db[index[0]][index[1]][index[2]].concat([obj.val]);
                          else
                            db[index[0]][index[1]][index[2]][db[index[0]][index[1]][index[2]].length] = obj.val;
                        }
                        else if (len === 4)
                        {
                          if (db[index[0]] === 's')
                            db[index[0]][index[1]][index[2]][index[3]] = db[index[0]][index[1]][index[2]][index[3]].concat([obj.val]);
                          else
                            db[index[0]][index[1]][index[2]][index[3]][db[index[0]][index[1]][index[2]][index[3]].length] = obj.val;
                        }
                        else if (len === 5)
                        {
                          if (db[index[0]] === 's')
                            db[index[0]][index[1]][index[2]][index[3]][index[4]] = db[index[0]][index[1]][index[2]][index[3]][index[4]].concat([obj.val]);
                          else
                            db[index[0]][index[1]][index[2]][index[3]][index[4]][db[index[0]][index[1]][index[2]][index[3]][index[4]].length] = obj.val;

                        }
                      },


                    }))
                  .pipe(c)
                  .on('close', function()
                  {
                    ws.close();
                    console.log('c close');

                  })
                  .on('error', function()
                  {
                    ws.close();
                    console.log('c error');
                  })
                  .on('finish', function()
                  {
                    ws.close();
                    console.log('DBHolder  stream finished');

                  });
              });
        };

        main();
      });
}
else
{
  log('something wrong');
  process.exit(1);
}
