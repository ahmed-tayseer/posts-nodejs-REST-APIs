// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(' ');

let io;
module.exports = {
  init: httpServer => {
    // socket is taking the server as input to establish a connection
    io = require('socket.io')(httpServer, {
      // IMP to set cors to allow it for socket also
      cors: {
        origin: process.env.ALLOWED_ORIGIN,
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("io didn't initialized");
    return io;
  },
};
