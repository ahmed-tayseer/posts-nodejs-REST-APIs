let io;

module.exports = {
  init: httpServer => {
    // socket is taking the server as input to establish a connection
    io = require('socket.io')(httpServer, {
      // IMP to set cors to allow it for socket also
      cors: {
        origin: 'http://localhost:3000',
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("io didn't initialized");
    return io;
  },
};
