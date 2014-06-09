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
