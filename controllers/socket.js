const { Socket } = require("socket.io");
const { comprobeJWT } = require("../helpers/generate-jwt");
const ChatMessages = require("../models/chat-messages");

const chatMessages = new ChatMessages();

const socketController = async (socket = new Socket(), io) => {
  const user = await comprobeJWT(socket.handshake.headers["x-token"]);

  if (!user) {
    return socket.disconnect();
  }

  // Agregar el user conectado
  chatMessages.connectUser(user);
  io.emit("users-active", chatMessages.usersArr);
  socket.emit("receive-messages", chatMessages.last10);

  // Conectarlo a una sala especial
  socket.join(user.id); // global, socket.id, user.id

  // Limpiar cuando alguien se desconeta
  socket.on("disconnect", () => {
    chatMessages.disconnectUser(user.id);
    io.emit("users-active", chatMessages.usersArr);
  });

  socket.on("send-message", ({ uid, message }) => {
    if (uid) {
      // Mensaje privado
      socket.to(uid).emit("private-message", { of: user.name, message });
    } else {
      chatMessages.sendMessage(user.id, user.name, message);
      io.emit("receive-messages", chatMessages.last10);
    }
  });
};

module.exports = {
  socketController,
};
