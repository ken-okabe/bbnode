/* jshint node: true */
/* jshint sub: true */
/* global window, $,alert */
'use strict';

var moduleID = '@list_thread';

var g = window;

var log = function(msg)
{
  console.log(moduleID + ':', msg);
};


var task = function()
{
  //alert(moduleID);

  //---------------

  var obj = g.io.list_thread;

  log(Object.keys(obj).length);
  obj.map(function(o)
  {
    log('----');
    log(o);

    log(o.postid);
    log(o.postdata);

    log(o.postdata.threadtitle);

    log(o.postdata.html);

    log(o.postdata.time);

    log('=================');
    log(o.user);
    // log(o.postdata['*tag'].toArray());






    $(g.io.panel)
      .appendTo(g.io.$list_thread);


  });
  //------------------


};

var watch = require("watchjs").watch;
watch(g.io, 'list_threadFlag', function()
{
  log('!!!!!!!!!!!!!!!!');
  //=====================================

  task();

});

var init = function()
{
  log('init');
  // alert('get');
  $.get('/www/modules/list_thread/client/list_thread.html', function(data)
  {
    g.io.panel = data;
  });

};

init();

module.exports = {
  start: function()
  {
    log('start');
    //  task();
  }

};
