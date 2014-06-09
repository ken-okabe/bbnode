/* jshint node: true */
/* jshint sub: true */
/* global window, $,alert */
'use strict';

var moduleID = '@areacontrol';

var g = window;

var log = function(msg)
{
  console.log(moduleID + ':', msg);
};

var task = function()
{
  //alert(moduleID);
  //=====================================
  var keys = g.io.path.split('/');
  var key = keys[1];
  if (key === 'area')
  {
    var area = keys[2];
    log('----------');
    log(g.io.bbname);

    $('#bbname')
      .text(area + ' ' + g.io.bbname)
      .addClass('link')
      .attr('target', '/area/' + area)
      .css('cursor', 'pointer');

    $('#bbtitle').html(area);
    $('#bbdescription').html('adfasdfasfsadfasdfasd');

    // if area face page, Draw categories
    if (!keys[3])
    {
      var $main = $('#main');
      $main.html('');

      var $jb = $('<div class="jumbotron"/>').appendTo($main);
      $('<h1/>').html(area).appendTo($jb);
      $('<p/>').html('brabarabara').appendTo($jb);

      var $row = $main.append('<div class="row"/>');　

      log('categories');
      log(g.io.categories);
      var $categoryDIV = [];

      g.io.categories
        .map(function(category)
        {
          log(category.title);
          $categoryDIV[category.title] = $('<div class="col-6 col-sm-6 col-lg-4"/>')
            .append('<h1>' + category.title + '</hi>')
            .append('<p>' + category.sub + '</p>')
            .addClass('link')
            .attr('target', '/area/' + area + '/category/' + category.title)
            .css('cursor', 'pointer');


          $row
            .append($categoryDIV[category.title]);

        });

    }
  }
};

var watch = require("watchjs").watch;
watch(g.io, 'path', function()
{
  log('!!!!!!!!!!!!!!!!');
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

}
