var rc = require('./rcrypt/crypt.js');

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
    users.push([data[0], data[1], client.id]);
    client.emit('getkey', scrypt);
    client.emit('getmessages', messages);
    io.emit('userjoin', [data[0], data[1], client.id]);
  });

  client.on('message', function(data){
    messages.push([data[0], new Date(), data[1]]);
    io.emit('message', [data[0], new Date(), data[1]]);
    console.log([data[0], new Date(), data[1]]);
  });

  client.on('disconnect', function(){
    for (var i = 0; i < users.length; i++) {
      if(users[i][2] == client.id) {
        io.emit('userleft', users[i]);
        console.log(`${users[i][0]} disconnected`);
      }
    }
  });
}
