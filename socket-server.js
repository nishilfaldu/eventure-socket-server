/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer } from "http";

import { Server } from "socket.io";



const PORT = 8080;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


io.on("connection", async socket => {
  console.log("socket connected", socket.id);

  // emit id to client
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  // call user
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    // console.log("callUser in socket server", { userToCall, signalData, from, name });
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  // answer call
  socket.on("answerCall", data => {
    // console.log("answerCall in socket server", data);
    io.to(data.to).emit("callAccepted", data.signal, data.whoAnswered);
  });

  // Handle user connection event
  socket.on("userConnected", ({ userId }) => {
    console.log(`User ${userId} connected`);
    // Store the socket ID and user ID association in your server's memory, database, or cache
  });

  //   socket.on("reconnect", () => {
  //     console.log("Reconnected to server with socket ID:", socket.id);
  //     // Emit user ID to the server upon reconnection
  //     socket.emit("userConnected", userId);
  //   });
});

httpServer.listen(PORT, () => {
  console.log("Server is listening on port: ", PORT);
});
