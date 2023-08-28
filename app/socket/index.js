
module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log('[Socket.io] Client Connected ID : ' + socket.id);
        socket.on('disconnect', () => {
            console.log('[Socket.io] Client Disconnected ID : ' + socket.id);
        });


    });
};