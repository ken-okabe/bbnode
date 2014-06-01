'use strict';
/*global window, require, console, __dirname, $,alert*/

var dev = true;
var log = function(msg)
{
    console.log(msg);
};
log('init');

$.getJSON("../config.json", function(data)
{
    var host;
    if (dev)
        host = 'http://localhost';
    else
        host = data.url;
    var port = data.port;

    $('document').ready(function()
    {
        alert(host + ':' + port);

        var io = require('socket.io-client');

        var socket = io.connect(host);
        socket.on('connect', function()
        {
            log('socket connected');
        });

    });

});
