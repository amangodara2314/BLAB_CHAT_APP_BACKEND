const userSocketMap = new Map();

function handleUserConnection(socket) {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    userSocketMap.forEach((value, key) => {
      if (value === socket.id) {
        userSocketMap.delete(key);
      }
    });
  });

  socket.on("login", (userId) => {
    console.log(`User logged in: ${userId}`);
    userSocketMap.set(userId, socket.id);
  });

  socket.on("reconnect", () => {
    const userId = socket.userId;
    if (userId) {
      // Update the mapping with the new socket ID
      userSocketMap.set(userId, socket.id);
      console.log(
        `User ID: ${userId} reconnected with Socket ID: ${socket.id}`
      );
    } else {
      console.log(`Unable to associate the reconnected socket with a user ID`);
    }
  });
}

function getUserSocket(userId) {
  return userSocketMap.get(userId);
}

module.exports = { handleUserConnection, getUserSocket, userSocketMap };
