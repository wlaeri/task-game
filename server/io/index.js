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

        socket.on('adduser', function(userId, chatId){
        	socket.room = chatId;
        	socket.join(chatId);
        	connectedUser.push(userIid);
        })

        socket.on('send:message', function(data){
        	socket.broadcast.to(socket.room).emit('updates', data)
        })
    });


    
    return io;

};
