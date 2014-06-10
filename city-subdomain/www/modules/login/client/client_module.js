/* jshint node: true */
/* jshint sub: true */
/* global window, $,localStorage,alert */
'use strict';

var moduleID = '@login';

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
  if (key === 'login')
  {
    //===========================
    $('#main').html(g.io.login);

    var secureRandom = require('secure-random');
    var bytes = secureRandom(30); //return an Array of 10 bytes

    var tryingkey = new Buffer(bytes).toString('hex');
    localStorage.setItem('loginkey', tryingkey);


    //===========================
  }
  else if (key === 'logout')
  {
    //===========================
    log(key);
    $('#main').html(g.io.logout);

    localStorage.removeItem('loginkey');

  }
  else
  {
    var loginkey = localStorage.getItem('loginkey');
    log(loginkey);
    if (!loginkey)
    {
      alert('no key');

    }
    else
    {

      alert('logging in:' + loginkey);


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

  $.get('/www/modules/login/client/login.html', function(data)
  {
    g.io.login = data;
  });

  $.get('/www/modules/login/client/logout.html', function(data)
  {
    g.io.logout = data;
  });

  var $li = $('nav').append('<li/>');

  var $div = $('<div/>')
    .text('Logout')
    .addClass('link')
    .attr('target', '/logout')
    .css('cursor', 'pointer')
    .appendTo($('body'));


};

init();

module.exports = {
  start: function()
  {
    log('start');

    task();
  }

};
