/* jshint node: true */
/* jshint sub: true */
/* global window, $,alert */
'use strict';

var moduleID = '@categorycontrol';

var g = window;

var log = function(msg)
{
  console.log(moduleID + ':', msg);
};


var task = function()
{

  var keys = g.io.path.split('/');
  var key = keys[3];
  if (key === 'category')
  {
    var category = keys[4];　
    log(category);
    g.io.$main = $('#main');
    g.io.$list_thread = g.io.$main.html('<div id = "list_thread"/>');

    var area = keys[2];
    g.io.socket
      .emit('msg',
        {
          cmd: moduleID,
          sub: 'query',
          data: [area, category]
        },
        function(result)
        {
          log('============');

          var obj = JSON.parse(result);
          log(obj);



          g.io.list_thread = obj;
          g.io.list_threadFlag = !g.io.list_threadFlag;

        }
    );


  }
};

var watch = require("watchjs").watch;
watch(g.io, 'path', function()
{
  log('!!!!!!!!!!!!!!!!');
  //=====================================

  //=====================================

  task();

  //==========================================

});

var init = function()
{
  log('init');
  g.io.list_threadFlag = false;
};

init();

module.exports = {
  start: function()
  {
    log('start');
    task();
  }

};
