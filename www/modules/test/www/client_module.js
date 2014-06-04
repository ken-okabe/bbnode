/* jshint node: true */
/* jshint sub: true */
'use strict';

var moduleID = '@test';

var log = function(msg)
{
  console.log(moduleID + ':', msg);
};

var init = function()
{
  log('init');

};

init();


module.exports = {
  socket: function(socket)
  {
    log('socket pass');

    socket.emit('msg',
      {
        cmd: moduleID,
        sub: 'hi',
        data: 'heloooooooo'
      },
      function(data)
      {
        log(data);
      });
  }

};
