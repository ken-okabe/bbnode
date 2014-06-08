/* jshint node: true */
/* jshint sub: true */
'use strict';

var log = function(msg)
{
  var util = require('util');
  process.stdout.write('CORE: ');
  process.stdout.write(util.inspect(msg,
  {
    depth: 99,
    colors: true
  }));
  process.stdout.write('\n');
};

//initial one-time log on the app launch
var os = require('os');
log('!!!!!! App = Node>app.js Launced !!!!!!!!!');
log(['OS Hostname:', os.hostname()].join(' '));
log(['OS Type:', os.type()].join(' '));
log(['OS Platform:', os.platform()].join(' '));
log(['OS Architecture:', os.arch()].join(' '));
log(['OS Total memory:', os.totalmem() / 1000 / 1000].join(' '));
log(['OS Free  memory:', os.freemem() / 1000 / 1000].join(' '));

var fs = require('fs');
log('==== load www Files on memory====');
var wwwDir = __dirname + '/www';
var wwwObj = {};

var seekDir = function(dir)
{
  fs.readdir(dir, function(err, dirA)
  {
    if (err)
    {
      var path0 = err.path;

      fs.readFile(path0, function(err, data)
      {
        if (err) throw err;
        var path1 = path0.split(wwwDir)[1];
        wwwObj[path1] = data;
        //  log(path1);
      });

    }
    else
    {
      for (var index in dirA)
      {
        //  log(dirA[ index ]);
        seekDir(dir + '/' + dirA[index]);
      }
    }
  });
};
seekDir(wwwDir);

log('g.d');
var _ = require('lazy.js');

var g = global;

try
{
  //============================================================================
  //clone g.d--------

  g.d = [];

  //-----------

  log('---load modules---');

  fs.readdir('./www/modules', function(err, modulesDir)
  {
    log(modulesDir);
    //modules
    log('--modules init(require)');

    var modules = [];
    modulesDir.map(function(modulename)
    {
      log(modulename + ' is loading');
      modules[modulename] = require('./www/modules/' + modulename + '/module');
    });
    log(modules);
    //=======================
    log('===read ./config/server.json');
    fs
      .readFile('./config/server.json',
        'utf8',
        function(err, data)
        {
          if (err)
          {
            log('Error: ' + err);
            return;
          }
          var obj1 = JSON.parse(data);
          log(obj1);
          log('===read ./config/forum.json');
          fs
            .readFile('./config/forum.json',
              'utf8',
              function(err, data)
              {
                if (err)
                {
                  log('Error: ' + err);
                  return;
                }
                var obj2 = JSON.parse(data);
                log(obj2);

                g.d['forumconfig'] = obj2;

                var port = obj1.port;
                log('port: ' + port);

                log('===run server==========');
                //
                var http = require('http');
                var path = require('path');
                var url = require('url');

                var mimeTypes = {
                  'html': 'text/html',
                  'jpeg': 'image/jpeg',
                  'jpg': 'image/jpeg',
                  'png': 'image/png',
                  'js': 'text/javascript',
                  'css': 'text/css'
                };

                var server = http
                  .createServer(function(req, res)
                  {
                    log('->http requestet---');
                    var requestedURL = url.parse(req.url)
                      .pathname;
                    log(requestedURL);


                    try
                    {
                      var uri;
                      var urlA = requestedURL.split('/');
                      if (requestedURL === '/')
                      {
                        uri = '/index.html';
                        log('/ -> /index.html');
                      }
                      else
                      {
                        var key = urlA[1];
                        log('key: ' + key);

                        if (key === 'www')
                          uri = requestedURL.split('/www')[1];
                        else
                          uri = '/index.html';
                      }

                      var mimeType = mimeTypes[path.extname(uri).split('.')[1]];
                      log(mimeType);
                      res.writeHead(200,
                      {
                        'Content-Type': mimeType
                      });
                      if (!wwwObj[uri])
                      {
                        log('no file');
                        res.writeHead(404,
                        {
                          'Content-Type': 'text/plain'
                        });
                        res.write('404 Not Found\n');
                        res.end();
                        return;
                      }
                      else
                      {
                        res.end(wwwObj[uri]);
                      }
                    }
                    catch (e)
                    {
                      return;
                    }

                  })
                  .listen(port, function()
                  {
                    log('HTTP listening ' + port);

                    //--------------------

                    //-------------------
                  });

                var socketio = require('socket.io')(server);
                /*
              socketio.configure('production', function()
              {
                  log(" set config for production");
                  io.enable('browser client minification'); // send minified client
                  io.enable('browser client etag'); // apply etag caching logic based on version number
                  io.enable('browser client gzip'); // gzip the file
                  io.set('log level', 1); // reduce logging
                  io.set('transports', [ // enable all transports (optional if you want flashsocket)
                      'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'
                  ]);
              });
              */
                socketio
                  .on('connection',
                    function(socket)
                    {
                      log('socket connected: ' + socket.id);


                      //---------
                      socket
                        .on('msg',
                          function(msg, f)
                          {
                            log(msg);

                            if (msg.cmd === 'socketid')
                            {
                              f(socket.id);
                            }
                            if (msg.cmd === 'modulecount')
                            {
                              log('moduleslength');
                              log(Object.keys(modules).length);
                              f(Object.keys(modules).length);
                            }
                            if (msg.cmd === 'bbnamecategory')
                            {
                              f(
                              {
                                bbname: g.d['forumconfig'].bbname,
                                categories: g.d['forumconfig'].category
                              });

                            }

                            // 'readyformodules'
                            if (msg.cmd === 'readyformodules') //<2> see index.js
                            {
                              //--- after bbnode info is passed , load whole module and socket connect
                              log('loading modules=======');
                              modulesDir
                                .map(function(modulename)
                                {
                                  // module socket @server
                                  log('loading module @' + modulename);
                                  modules[modulename].socket(socket);

                                  // invoke module socket @client (emit via socket.io, so time-gap)
                                  socket.emit('msg',
                                  {
                                    cmd: 'module',
                                    sub: null,
                                    data: modulename
                                  });

                                  //====These sockets corresponds in each side modules
                                });
                              //----------------------------------

                            }


                          })
                        .on('disconnect',
                          function()
                          {
                            log('disconnected: ' + socket.id);
                          })
                        .on('reconnect',
                          function()
                          {
                            log('reconnected: ' + socket.id);
                          });



                    });

                //===========




                //===================
                if (!g.d['x'])
                {
                  log('db is blank, need to construct now');
                  g.d['x'] = []; //index for g.d
                  g.d['tag'] = [];

                  g.d['tag']['post'] = [];
                  g.d['tag']['thread'] = [];

                  g.d['forumconfig'].category
                    .map(function(category)
                    {
                      log(category);

                      g.d['tag']['post']['*' + category.title] = _([]);
                      g.d['tag']['thread']['*' + category.title] = _([]);
                    });


                  g.d['forumconfig'].area
                    .map(function(area)
                    {
                      log(area);

                      g.d['tag']['post']['*' + area] = _([]);
                      g.d['tag']['thread']['*' + area] = _([]);
                    });

                  //============
                  log('==========================!!');
                  log(g.d);
                  //=============

                  g.d['id'] = []; // user id

                  g.d['id'][0] = [];
                  g.d['id'][0]['email'] = 'adm.bbnode@gmail.com';
                  g.d['id'][0]['name'] = 'ken';

                  log(g.d['id'][0]['email']);


                  g.d['x']['email-id'] = [];
                  g.d['x']['email-id']['adm.bbnode@gmail.com'] = 0;

                  var id = g.d['x']['email-id']['adm.bbnode@gmail.com'];
                  log(g.d['id'][id]['name']);
                  g.d['postid'] = [];
                  g.d['postid'][0] = [];
                  g.d['postid'][0]['userid'] = 0;
                  g.d['postid'][0]['time'] = 20010101125900;
                  g.d['postid'][0]['html'] = 'hello';
                  g.d['postid'][0]['threadid'] = 100;
                  g.d['postid'][0]['threadtitle'] = null;
                  g.d['postid'][0]['threadorder'] = 2;
                  g.d['postid'][0]['*tag'] = _([]);
                  g.d['postid'][0]['*tag'] = g.d['postid'][0]['*tag'].concat(['全国']);


                  g.d['tag']['post']['*全国'] = g.d['tag']['post']['*全国'].concat([0]);
                  g.d['tag']['post']['*兵庫'] = g.d['tag']['post']['*兵庫'].concat([0]);
                  g.d['tag']['post']['*神戸（兵庫）'] = g.d['tag']['post']['*神戸（兵庫）'].concat([0]); //add postid=0 to tag='兵庫県神戸市
                  g.d['tag']['post']['*求人'] = g.d['tag']['post']['*求人'].concat([0]); //add postid=0 to tag='tag'

                  g.d['tag']['thread']['*全国'] = g.d['tag']['thread']['*全国'].concat([0]);
                  g.d['tag']['thread']['*兵庫'] = g.d['tag']['thread']['*兵庫'].concat([0]);
                  g.d['tag']['thread']['*神戸（兵庫）'] = g.d['tag']['thread']['*神戸（兵庫）'].concat([0]); //add postid=0 to tag='兵庫県神戸市
                  g.d['tag']['thread']['*求人'] = g.d['tag']['thread']['*求人'].concat([0]); //add postid=0 to tag='tag'



                  var x = g.d['tag']['thread']['*求人']
                    .intersection(g.d['tag']['thread']['*神戸（兵庫）'])
                    .toArray();
                  log(x);

                }

                //=======================
              });
        });
  });

  //try============================================================================
}
catch (err)
{
  // handle the error safely
  console.log(err);
}
