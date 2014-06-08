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
    var $main = $('#main');
    $main.html('category');

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
          log(result);
        }
    );

    //    var $row = $main.append('<div class="row"/>');　

  }
};

var watch = require("watchjs").watch;
watch(g.io, 'path', function()
{
  log('!!!!!!!!!!!!!!!!');
  //=====================================
  alert('category-obseve');
  //=====================================

  task();

  //==========================================

});

var init = function()
{
  log('init');
};

init();

module.exports = {
  start: function()
  {
    log('start');
    task();
  }

};
