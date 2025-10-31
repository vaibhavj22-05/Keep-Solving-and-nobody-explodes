// src/pages/RoomPage.jsx
// import { useState, useEffect } from "react";
// import socket from "../socket";

// export default function RoomPage({ onRoomJoined }) {
//   const [roomCode, setRoomCode] = useState("");
//   const [status, setStatus] = useState("Not connected");
//   const [isCreator, setIsCreator] = useState(false);

//   useEffect(() => {
//     socket.on("connect", () => setStatus(`Connected (${socket.id})`));
//     socket.on("room-created", (code) => {
//       setRoomCode(code);
//       setIsCreator(true);
//       setStatus(`Room created: ${code} — waiting for another player`);
//     });

//     socket.on("room-ready", ({ code }) => {
//       setStatus(`Both players joined: ${code}`);
//       onRoomJoined(code);
//     });

//     socket.on("waiting-for-player", () => setStatus("Waiting for second player..."));
//     socket.on("error", (msg) => setStatus(`Error: ${msg}`));

//     return () => {
//       socket.off("connect");
//       socket.off("room-created");
//       socket.off("room-ready");
//       socket.off("waiting-for-player");
//       socket.off("error");
//     };
//   }, [onRoomJoined]);

//   const handleCreate = () => {
//     socket.emit("create-room");
//   };

//   const handleJoin = () => {
//     if (!roomCode.trim()) return setStatus("Enter room code");
//     socket.emit("join-room", roomCode.trim().toUpperCase());
//   };

//   return (
//     <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0c10", color: "white", fontFamily: "sans-serif" }}>
//       <div style={{ width: 420, padding: 20, background: "#121318", borderRadius: 12 }}>
//         <h2 style={{ marginBottom: 8, color: "#7dd3fc" }}>Create / Join Room</h2>
//         <p style={{ color: "#94a3b8" }}>{status}</p>

//         {!isCreator ? (
//           <>
//             <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//               <input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} placeholder="Enter room code" style={{ flex: 1, padding: 8, borderRadius: 6, background: "#0b1220", color: "white", border: "1px solid #223" }} />
//               <button onClick={handleJoin} style={{ padding: "8px 12px", background: "#10b981", border: "none", borderRadius: 6 }}>Join</button>
//             </div>
//             <div style={{ marginTop: 12 }}>
//               <button onClick={handleCreate} style={{ width: "100%", padding: 10, background: "#06b6d4", border: "none", borderRadius: 6 }}>Create Room</button>
//             </div>
//           </>
//         ) : (
//           <div style={{ marginTop: 12 }}>
//             <div style={{ fontSize: 20, fontWeight: "700", color: "#34d399" }}>{roomCode}</div>
//             <div style={{ marginTop: 8, color: "#94a3b8" }}>Share this code with a friend</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import socket from "../socket";

export default function RoomPage({ onRoomJoined }) {
  const [roomCode, setRoomCode] = useState("");
  const [status, setStatus] = useState("Not connected");
  const [isCreator, setIsCreator] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 4000);
    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    socket.on("connect", () => setStatus(`Connected (${socket.id})`));
    socket.on("room-created", (code) => {
      setRoomCode(code);
      setIsCreator(true);
      setStatus(`Room created: ${code} — waiting for another player`);
    });

    socket.on("room-ready", ({ code }) => {
      setStatus(`Both players joined: ${code}`);
      onRoomJoined(code);
    });

    socket.on("waiting-for-player", () => setStatus("Waiting for second player..."));
    socket.on("error", (msg) => setStatus(`Error: ${msg}`));

    return () => {
      socket.off("connect");
      socket.off("room-created");
      socket.off("room-ready");
      socket.off("waiting-for-player");
      socket.off("error");
    };
  }, [onRoomJoined]);

  const handleCreate = () => {
    socket.emit("create-room");
  };

  const handleJoin = () => {
    if (!roomCode.trim()) return setStatus("Enter room code");
    socket.emit("join-room", roomCode.trim().toUpperCase());
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white font-mono relative overflow-hidden p-4">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-black pointer-events-none" />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div 
          className="h-full w-full"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 2px, transparent 4px)',
            animation: 'scanline 8s linear infinite'
          }}
        />
      </div>

      {/* Corner brackets */}
      <div className="absolute top-5 left-5 w-20 h-20 border-l-2 border-t-2 border-yellow-500 opacity-60" />
      <div className="absolute top-5 right-5 w-20 h-20 border-r-2 border-t-2 border-yellow-500 opacity-60" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className={`text-4xl md:text-5xl font-black mb-3 transition-all duration-100 ${glitch ? 'text-red-500 scale-105' : 'text-white'}`}
            style={{
              textShadow: glitch 
                ? '2px 2px 0px #ff0000, -2px -2px 0px #00ff00'
                : '2px 2px 0px #dc2626, 4px 4px 15px rgba(220, 38, 38, 0.5)'
            }}
          >
            MISSION CONTROL
          </h1>
          <p className="text-gray-400 tracking-wider text-sm">ESTABLISH SECURE CONNECTION</p>
        </div>

        {/* Content card */}
        <div className="bg-black/60 border-2 border-red-500/50 rounded-xl p-6 backdrop-blur-sm shadow-lg shadow-red-500/20">
          {/* Status banner */}
          <div className="mb-6 bg-red-950/40 border-2 border-red-500/50 rounded-lg p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">System Status</div>
            <div className="text-cyan-400 font-bold text-sm">{status}</div>
          </div>

          {!isCreator ? (
            <>
              {/* Join room input */}
              <div className="mb-4 flex gap-2">
                <input 
                  value={roomCode} 
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())} 
                  placeholder="ENTER CODE" 
                  maxLength={6}
                  className="flex-1 px-4 py-3 bg-black/80 border-2 border-cyan-500/30 rounded-lg text-white text-center text-lg font-bold tracking-widest placeholder-gray-600 focus:border-cyan-500 focus:outline-none transition-all"
                />
                <button 
                  onClick={handleJoin}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-bold rounded-lg border-2 border-cyan-400 hover:scale-105 hover:border-yellow-400 hover:shadow-lg hover:shadow-cyan-500/50 active:scale-95 transition-all duration-200 tracking-wider"
                >
                  JOIN
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                <span className="text-gray-500 text-sm font-bold tracking-wider">OR</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              </div>

              {/* Create room button */}
              <div>
                <button 
                  onClick={handleCreate}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg border-2 border-red-400 hover:scale-105 hover:border-yellow-400 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 transition-all duration-200 tracking-wider"
                >
                  CREATE ROOM
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded-full mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-bold text-sm tracking-wider">ROOM ACTIVE</span>
              </div>

              <div className="mb-6">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Mission Code</div>
                <div 
                  className="text-5xl font-black text-green-400 tracking-wider p-4 bg-black/80 rounded-lg border-2 border-green-500/50"
                  style={{ textShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
                >
                  {roomCode}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <div className="text-gray-400 text-sm mb-2">Share this code with a friend</div>
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span>Waiting for second player...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs tracking-wider">
            <span className="text-red-400">⚠</span> SECURE CONNECTION REQUIRED
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}