var express = require('express'),
	app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(80);
app.use(express.static(__dirname + '/public'));

app.get('/*', function(req, res){
	res.sendfile(__dirname + '/public/views/layout.html');
});



var sockets = {};

io.sockets.on('connection', function(socket) {
	sockets[socket.id] = socket;

    socket.on('rtcdata', function(data) {
        sockets[data.to].emit('rtcdata', { from: socket.id, type: data.type, data: data.data });
    });

    socket.on('disconnect', function(){
    	delete sockets[socket.id];
    });
});