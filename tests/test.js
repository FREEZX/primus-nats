var Primus = require('primus');
var server = require('http').createServer();
var nats = require('nats').connect();
var pnats = require('../');

var primus = new Primus(server, { transformer: 'websockets', nats: nats });
primus.use('nats', pnats);

primus.on('connection', function(spark){
  spark.join('wtfcrew');
  setTimeout(function(){
    primus.emit('wtfcrew', 'OMGWTFBBQ');
  }, 300);
});
server.listen(3000);

Socket = primus.Socket;

client = new Socket('http://127.0.0.1:3000/');

client.on('open', function(){
  console.log('open');
});

client.on('data', function(data){
  console.log('Client received data');
  console.log(data);
});