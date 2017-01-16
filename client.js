var rc = require('../rcrypt.js');

var args = [];
process.argv.forEach(function (val, index, array) {
  args.push(val);
});

var scrypt = "";

var shouldrun = true;
var util = require('util');
var uid = rc.makeid(12);

if(args.length <= 3) {
  console.log('Invalid arguments. Usage: nodejs client.js <*HOST> <*USERNAME> <PASSWORD>');
  shouldrun = false;
}

if(shouldrun) {
  var socket = require('socket.io-client')(args[2]);

  socket.on('connect', function(){console.log(`Connected to ${args[2]}`); socket.emit('login',[args[3], uid])});
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
  socket.on('getkey', function(key){scrypt = key; console.log(key)});
}

process.stdin.on('data', function (text) {
  text = text.toString();
  if (text === '/quit\n') {
    //console.log('meme')
  } else if(text.length < 2048 && scrypt != "") {
    var enc = rc.encrypt(text, scrypt);
    socket.emit('message', [args[3], enc]);
  } else if(text.length > 2048 && scrypt != "") {
    text = text.substring(0, 2048);
    var enc = rc.encrypt(text, scrypt);
    socket.emit('message', [args[3], enc]);
  } else {
    console.log('something went wrong. try again later.');
  }
});
