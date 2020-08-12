import io from "socket.io-client";

export let mainSocket = null;
export const userSocket = (room) => {
  return new Promise((resolve) => {
    if (mainSocket?.connected === false || !mainSocket) {
      mainSocket = io.connect("http://localhost:2000");
      mainSocket.on("connection", () => {
        mainSocket.emit("join", room);
        resolve(mainSocket);
      });
    } else resolve(mainSocket);
  });
};
