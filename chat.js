var ecstatic = require('ecstatic');
var server = require('http').createServer(
  ecstatic({ root: __dirname, handleError: false })
);

var p2pserver = require('socket.io-p2p-server').Server;
var io = require('socket.io')(server);

server.listen(8091, function () {
  console.log('Listening on 8091');
});

io.use(p2pserver);

io.on('connection', function (socket) {
  socket.on('peer-msg', function (data) {
    console.log('Message from peer: %s', data)
    socket.broadcast.emit('peer-msg', data)
  });

});