'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    var connectedUsers = [];

    io.on('connection', function (socket) {
    	console.log("Socket is now connected, wowzers")
        // Now have access to socket, wowzers!

        socket.on('adduser', function(userId, gameId){
            console.log("***new User", userId, "has connected to game: ", gameId);
        	socket.room = gameId;
        	socket.join(gameId);
        	connectedUsers.push(userId);
        })

        socket.on('send:message', function(data){
            console.log("message received**", data);
        	socket.broadcast.to(socket.room).emit('updatechat', data);
        })
    });


    
    return io;

};
