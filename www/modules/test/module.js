/* jshint node: true */
/* jshint sub: true */
'use strict';

var log = function(msg)
{
  var util = require('util');
  process.stdout.write('@test: ');
  process.stdout.write(util.inspect(msg,
  {
    depth: 99,
    colors: true
  }));
  process.stdout.write('\n');
};

var init = function()
{
  log('init');

};

init();


module.exports = {
  socket: function(socket)
  {
    log(socket.id);

    socket
      .on('msg',
        function(msg, f)
        {
          if (msg.cmd === '@test')
          {
            log(msg);
            if (msg.sub === 'hi')
            {
              f(msg.data);
            }
          }
        });
  }

};
