// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // for dev; lock this down for prod
});

const PORT = process.env.PORT || 4000;

// Simple in-memory rooms map
// rooms[code] = { code, players: [{ id, name, role }], createdAt }
const rooms = {};

function makeCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // avoid ambiguous chars
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('createRoom', (payload, cb) => {
    let code;
    do {
      code = makeCode(6);
    } while (rooms[code]);

    rooms[code] = { code, players: [], createdAt: Date.now() };

    // add creator as a player (no role yet)
    const player = { id: socket.id, name: payload?.name || 'Player', role: null };
    rooms[code].players.push(player);
    socket.join(code);
    io.to(code).emit('roomUpdate', rooms[code]);
    cb && cb({ ok: true, roomCode: code, room: rooms[code] });
    console.log('room created', code);
  });

  socket.on('joinRoom', (data, cb) => {
    const { roomCode, name } = data || {};
    if (!roomCode || !rooms[roomCode]) {
      return cb && cb({ ok: false, error: 'Room not found' });
    }
    const room = rooms[roomCode];
    if (room.players.length >= 2) {
      return cb && cb({ ok: false, error: 'Room full' });
    }
    const player = { id: socket.id, name: name || 'Player', role: null };
    room.players.push(player);
    socket.join(roomCode);
    io.to(roomCode).emit('roomUpdate', room);
    cb && cb({ ok: true, room });
    console.log(`${socket.id} joined ${roomCode}`);
  });

  socket.on('chooseRole', (data, cb) => {
    // data: { roomCode, role } role is 'diffuser' | 'expert'
    const { roomCode, role, name } = data;
    const room = rooms[roomCode];
    if (!room) return cb && cb({ ok: false, error: 'Room not found' });

    // find this player
    const p = room.players.find(pl => pl.id === socket.id);
    if (!p) return cb && cb({ ok: false, error: 'Player not in room' });

    // If role already chosen by the other player, allow swap decisions client-side.
    p.role = role;
    if (name) p.name = name;

    io.to(roomCode).emit('roomUpdate', room);
    cb && cb({ ok: true, room });
  });

  socket.on('leaveRoom', (data) => {
    const { roomCode } = data || {};
    if (!roomCode || !rooms[roomCode]) return;
    const room = rooms[roomCode];
    room.players = room.players.filter(p => p.id !== socket.id);
    socket.leave(roomCode);
    io.to(roomCode).emit('roomUpdate', room);
    // delete room if empty after a short delay
    if (room.players.length === 0) {
      setTimeout(() => {
        if (rooms[roomCode] && rooms[roomCode].players.length === 0) delete rooms[roomCode];
      }, 60_000);
    }
  });

  socket.on('disconnect', () => {
    // remove player from any room they were in
    Object.keys(rooms).forEach(code => {
      const room = rooms[code];
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        io.to(code).emit('roomUpdate', room);
        if (room.players.length === 0) delete rooms[code];
      }
    });
    console.log('socket disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server listening on port ${PORT}`);
});
