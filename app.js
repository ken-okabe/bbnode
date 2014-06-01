//var myDomain = 'waipj02.herokuapp.com';
'use strict';
/*global require, console, __dirname*/
var log = console.log;
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
log('==== load public Files on memory====');
var publicDir = __dirname + '/public';
var publicObj = {};

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
                var path1 = path0.split(publicDir)[1];
                publicObj[path1] = data;
                log(path1);
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
seekDir(publicDir);
//=======================
log('===read ./public/config.json');
fs
    .readFile('./public/config.json', 'utf8',
        function(err, data)
        {
            if (err)
            {
                console.log('Error: ' + err);
                return;
            }

            var obj1 = JSON.parse(data);

            console.log(obj1);
            var port = obj1.port;
            console.log('port: ' + port);

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
                    log('!!!!!!http requestet!!!!!!!!!');
                    var uri = url.parse(req.url)
                        .pathname;
                    log(uri);
                    try
                    {
                        if (uri === '/')
                        {
                            uri = '/index.html';
                            log('/ -> /index.html');
                        }

                        var mimeType = mimeTypes[path.extname(uri).split('.')[1]];
                        log(mimeType);
                        res.writeHead(200,
                        {
                            'Content-Type': mimeType
                        });
                        if (!publicObj[uri])
                        {
                            log('no file');
                            /*
                            res.writeHead(200,
                            {
                                'Content-Type': 'text/html'
                            });
                            uri = '/index.html';
                            res.end(publicObj[uri]);
                            */
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
                            res.end(publicObj[uri]);
                        }
                    }
                    catch (e)
                    {
                        return;
                    }

                });

            var io = require('socket.io')(server);
            io.on('connection',
                function(socket)
                {
                    log('socket connected: ' + socket.id);
                    socket.on('event', function(data) {});
                    socket.on('disconnect', function() {});
                });


            server.
            listen(port, function()
            {
                console.log('HTTP listening ' + port);

                //--------------------



                //-------------------
            });

            //===================
        });
