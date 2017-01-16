var rc = require('../rcrypt.js');

var args = [];
process.argv.forEach(function (val, index, array) {
  args.push(val);
});

var scrypt = rc.makeid(2048);

var messages = [];
var users = [];

var shouldrun = true;
var util = require('util');

if(args.length <= 2) {
  console.log('Invalid arguments. Usage: nodejs server.js <*PORT> <NAME> <PASSWORD>');
  shouldrun = false;
}

if(shouldrun) {
  var server = require('http').createServer();
  var io = require('socket.io')(server);
  io.on('connection', handleConnect);
  server.listen(args[2]);

}

function handleConnect(client) {
  console.log('connected');
  client.on('login', function(data){
    users.push([data[0], data[1]]);
    client.emit('getkey', scrypt);
  });
  client.on('message', function(data){
    var d = new Date(hours, minutes, seconds);
    messages.push([data[0], d, data[1]]);
    console.log([data[0], d, data[1]]);
  });
  client.on('disconnect', function(){console.log('disconnected');});
}
