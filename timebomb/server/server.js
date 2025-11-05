// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.static(path.join(process.cwd(), "public"))); // serve public files
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rooms = {}; // { CODE: { players: [], roles: {} } }

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ✅ Load questions.json
let questions = {};
const questionsPath = path.join(process.cwd(), "data", "questions.json");
try {
  const raw = fs.readFileSync(questionsPath, "utf-8");
  questions = JSON.parse(raw);
  console.log("✅ Loaded questions.json");
} catch (err) {
  console.warn("⚠️ Could not load questions.json from", questionsPath, err.message);
  questions = {};
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

  // ✅ Diffuser opens module -> send question to expert
  socket.on("moduleOpened", ({ roomCode, moduleId }) => {
    try {
      console.log(`📣 moduleOpened: room=${roomCode} module=${moduleId} by ${socket.id}`);

      const room = rooms[roomCode];
      if (!room) {
        socket.emit("error", "Invalid room");
        return;
      }

      const expertSocketId = Object.keys(room.roles).find(
        (id) => room.roles[id] === "expert"
      );
      if (!expertSocketId) {
        socket.emit("error", "Expert not assigned/connected yet");
        return;
      }

      // 🔹 Pick a random question for this module
      const moduleQuestions = questions[moduleId];
      if (!moduleQuestions || moduleQuestions.length === 0) {
        socket.emit("error", `No questions configured for module ${moduleId}`);
        return;
      }

      const q = moduleQuestions[Math.floor(Math.random() * moduleQuestions.length)];
      const questionIndex = moduleQuestions.indexOf(q);

      // 🧠 Store for tracking
      room.lastQuestion = { moduleId, questionIndex };

      // 👨‍🔬 Send question to expert (changed from 'show-question' → 'promptQuestion')
      io.to(expertSocketId).emit("promptQuestion", {
        roomCode,
        moduleId,
        question: q.question,
        choices: q.choices || ["A", "B", "C", "D"], // default fallback
      });

      // 💣 Send correct answer privately to diffuser
      io.to(socket.id).emit("wire-answer", {
        roomCode,
        moduleId,
        correctAnswer: q.answer,
      });

      console.log("📡 Sent promptQuestion to expert:", expertSocketId);

    } catch (err) {
      console.error("Error in moduleOpened handler:", err);
      socket.emit("error", "Server error opening module");
    }
  });

  // ✅ Expert submits answer
  socket.on("submitAnswer", ({ roomCode, moduleId, selectedAnswer }) => {
    try {
      console.log(`✉️ submitAnswer in room=${roomCode} module=${moduleId}:`, selectedAnswer);

      const room = rooms[roomCode];
      if (!room) return;

      io.to(roomCode).emit("moduleAnswer", {
        roomCode,
        moduleId,
        selectedAnswer,
      });
    } catch (err) {
      console.error("Error in submitAnswer handler:", err);
      socket.emit("error", "Server error submitting answer");
    }
  });

  // ✅ Disconnect cleanup
  socket.on("disconnect", () => {
    console.log("❌ Disconnected", socket.id);
    for (const code of Object.keys(rooms)) {
      const r = rooms[code];
      r.players = r.players.filter((id) => id !== socket.id);
      if (r.roles && r.roles[socket.id]) delete r.roles[socket.id];
      if (r.players.length === 0) delete rooms[code];
    }
  });
});

server.listen(5000, () => console.log("🚀 Server running on 5000"));
