const port = 3000;
const io = require('socket.io')(port);

io.on('connection',
    (socket) => {
        console.log('socket connected');
        socket.on("disconnect", (reason) => {
            console.log("disconnecting");
        });

        socket.onAny((event, data) => {
            console.log(event, data);
            socket.emit(event, data);
        });
    }
);