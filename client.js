var rc = require('./rcrypt/crypt.js');
var colors = require('colors');

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
  socket.on('getkey', function(key){scrypt=key});
  socket.on('message', messageIn);
  socket.on('getmessages', allMessageIn);
  socket.on('userleft', (user)=>{console.warn(colors.yellow(`${user[0]} has disconnected.`))});
  socket.on('userjoin', (user)=>{console.warn(colors.green(`${user[0]} has joined.`))});
}

process.stdin.on('data', function (text) {
  text = text.toString();
  if (text === '/quit\n') {
    io.disconnect();
    process.exit();
  } else if(text.length < 2048 && text.length > 2 && scrypt != "") {
    var enc = rc.encrypt(text, scrypt);
    socket.emit('message', [args[3], enc[0]]);
    console.log(' ');
  } else if(text.length > 2048 && text.length > 2 && scrypt != "") {
    text = text.substring(0, 2048);
    var enc = rc.encrypt(text, scrypt);
    socket.emit('message', [args[3], enc[0]]);
    console.log(' ');
  } else if(scrypt == ""){
    console.log('No encryption key gotten from server. Please try to reconnect.');
  } else if(text.length <= 2){

  } else {
    console.log('Something went wrong. Try again later.')
  }
});

function messageIn(data, isall) {
  if(data[0] != args[3]) {
    var msgdec = rc.decrypt(data[2], scrypt);
    var d = new Date(data[1]);
    console.log(`<${("0" + (d.getHours() + 1)).slice(-2)}:${("0" + (d.getMinutes() + 1)).slice(-2)}:${("0" + (d.getSeconds() + 1)).slice(-2)}> `+`"${data[0]}"`.bold+`: ${msgdec}`);
  } else if (isall) {
    var msgdec = rc.decrypt(data[2], scrypt);
    var d = new Date(data[1]);
    console.log(`<${("0" + (d.getHours() + 1)).slice(-2)}:${("0" + (d.getMinutes() + 1)).slice(-2)}:${("0" + (d.getSeconds() + 1)).slice(-2)}> `+`"${data[0]}"`.bold+`: ${msgdec}`);
  }
}

function allMessageIn(data) {
  for (var i = 0; i < data.length; i++) {
    messageIn(data[i], true);
  }
}
