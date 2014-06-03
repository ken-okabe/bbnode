/* jshint node: true */
/* jshint sub: true */
'use strict';

var log = function(msg)
{
  var util = require('util');
  console.log(util.inspect(msg,
  {
    depth: 99,
    colors: true
  }));
};


var init = function()
{
  log('test hello');

};


init();
