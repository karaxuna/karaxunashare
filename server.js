var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

io.set('transports', ['xhr-polling']);
server.listen(process.env.PORT || 8081);

app.use(express.static(__dirname + '/public'));

app.get('/*', function(req, res){
    res.sendfile(__dirname + '/public/views/layout.html');
});


var sockets = {};

io.sockets.on('connection', function(socket) {
    sockets[socket.id] = socket;

    socket.on('rtcdata', function(data) {
        var st = sockets[data.to];
        if(st)
            st.emit('rtcdata', { from: socket.id, type: data.type, data: data.data });
        else
            socket.emit('error', { message: 'socket does not exist' });
    });

    socket.on('disconnect', function(){
    	delete sockets[socket.id];
    });
});
