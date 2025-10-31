import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rooms = {}; // { CODE: { players: [], roles: {} } }

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

io.on("connection", (socket) => {
  console.log("🔌 connected", socket.id);

  // ✅ Create Room
  socket.on("create-room", () => {
    const code = generateRoomCode();
    rooms[code] = { players: [socket.id], roles: {} };
    socket.join(code);
    console.log("🎯 Room created:", code);
    socket.emit("room-created", code);
  });

  // ✅ Join Room
  socket.on("join-room", (code) => {
    const room = rooms[code];
    if (!room) {
      socket.emit("error", "Invalid room code");
      return;
    }

    if (room.players.length >= 2) {
      socket.emit("error", "Room full");
      return;
    }

    room.players.push(socket.id);
    socket.join(code);
    console.log("👥 Player joined:", socket.id, "Room:", code, "Players:", room.players);

    if (room.players.length === 2) {
      console.log("🚀 Both players joined — Emitting 'room-ready'");
      io.to(code).emit("room-ready", { code, players: room.players });
    } else {
      socket.emit("waiting-for-player");
    }
  });

  // ✅ Choose Role
  socket.on("choose-role", ({ roomCode, role }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const other = room.players.find((id) => id !== socket.id);
    if (Object.keys(room.roles).length === 0) {
      // first player chooses
      room.roles[socket.id] = role;
      if (other) {
        const otherRole = role === "diffuser" ? "expert" : "diffuser";
        room.roles[other] = otherRole;
        io.to(socket.id).emit("role-assigned", { yourRole: role });
        io.to(other).emit("role-assigned", { yourRole: otherRole });
      } else {
        socket.emit("waiting-for-player");
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected", socket.id);
    for (const code of Object.keys(rooms)) {
      const r = rooms[code];
      r.players = r.players.filter((id) => id !== socket.id);
      if (r.players.length === 0) delete rooms[code];
    }
  });
});

server.listen(5000, () => console.log("🚀 Server running on 5000"));
