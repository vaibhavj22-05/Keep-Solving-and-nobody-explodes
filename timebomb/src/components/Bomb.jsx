import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Module from "./modules/Module";
import useSound from "../hooks/useSound";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

export default function BombLayout() {
  // Styling from your original file
  const moduleStyle =
    "rounded-xl border-[3px] border-gray-700 bg-gradient-to-b from-[#2c2f34] to-[#1a1c20] shadow-[inset_0_2px_6px_rgba(255,255,255,0.08),0_10px_25px_rgba(0,0,0,0.8)] p-3 relative overflow-hidden";

  const getModuleSetup = () => {
    const totalSlots = 6;
    const fixedModules = ["timer", "wires", "chemical", "button", null];
    const emptySlots = Array(totalSlots - fixedModules.length).fill(null);
    return [...fixedModules, ...emptySlots].sort(() => Math.random() - 0.5);
  };

  const [moduleSetup, setModuleSetup] = useState([]);
  const [modulesSolved, setModulesSolved] = useState({
    wires: false,
    chemical: false,
  });
  const [buttonUnlocked, setButtonUnlocked] = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const [defused, setDefused] = useState(false);

  const bgAudio = useRef(null);
  const playSound = useSound();

  // Socket ref
  const socketRef = useRef(null);

  // Read roomCode from router location state (passed from DiffuserPage)
  const location = useLocation();
  const roomCode = location?.state?.roomCode;

  // 🎵 Start game BGM
  useEffect(() => {
    bgAudio.current = new Audio("/sounds/spike.mp3");
    bgAudio.current.loop = true;
    bgAudio.current.volume = 0.2;
    // wrap play in try/catch for browser autoplay restrictions
    bgAudio.current.play().catch(() => {
      // user gesture required — fine
    });
    return () => bgAudio.current?.pause();
  }, []);

  // 🧩 Generate module layout
  useEffect(() => {
    setModuleSetup(getModuleSetup());
  }, []);

  // 🔄 Pass solved callback to modules
  const handleModuleSolved = (name) => {
    setModulesSolved((prev) => ({ ...prev, [name]: true }));
  };

  // Create / manage socket connection, join room, choose role
  useEffect(() => {
    // only attempt socket if we have a roomCode
    if (!roomCode) {
      console.warn("Bomb mounted without roomCode in location.state");
      return;
    }

    // Create socket connection (adjust URL if your server is on a different host)
    const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected (diffuser):", socket.id);
      // Join the room and choose role 'diffuser'
      socket.emit("join-room", roomCode);
      socket.emit("choose-role", { roomCode, role: "diffuser" });
    });

    // Log server messages / errors
    socket.on("error", (msg) => {
      console.warn("Server error:", msg);
    });

    // Optional: listen for moduleAnswer broadcasts (expert's submitted answer)
    socket.on("moduleAnswer", ({ roomCode: rc, moduleId, selectedAnswer }) => {
      if (rc !== roomCode) return;
      console.log("Received moduleAnswer:", moduleId, selectedAnswer);
      // Simple UI notification — replace with your in-game notification if needed
      // We are not storing to localStorage now (per your instruction to skip storage)
      window.alert(`Expert answered for ${moduleId}: ${selectedAnswer}`);
    });

    return () => {
      // cleanup
      try {
        socket.disconnect();
      } catch (e) {}
      socketRef.current = null;
    };
  }, [roomCode]);

  // Handler when a module is opened by diffuser
  const handleModuleOpen = useCallback(
    (type) => {
      // Map your module type to manual moduleId naming if necessary
      // e.g., 'wires' -> 'wire' to match manual.json
      const moduleId = type === "wires" ? "wire" : type;

      if (!socketRef.current || !roomCode) {
        console.warn("Cannot open module, socket or roomCode missing");
        return;
      }

      console.log("Emitting moduleOpened ->", { roomCode, moduleId });
      socketRef.current.emit("moduleOpened", { roomCode, moduleId });
      // Provide immediate local feedback if you want
      // e.g., show a wait state inside that module slot (not implemented here)
    },
    [roomCode]
  );

  // Render
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,_#050607_0%,_#0a0c10_100%)]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative grid grid-cols-3 gap-5 w-[900px] h-[520px] p-5 
                   rounded-2xl border-[10px] border-[#5e5e5e]
                   bg-gradient-to-br from-[#4e525a] to-[#2e3034]
                   shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_4px_10px_rgba(255,255,255,0.06)]"
      >
        {/* Decorative screws */}
        {[
          "top-2 left-2",
          "top-2 right-2",
          "bottom-2 left-2",
          "bottom-2 right-2",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-5 h-5 rounded-full bg-gradient-to-br from-gray-400 to-gray-800 border border-gray-900 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.4)]`}
          >
            <div className="absolute left-1/2 top-1/2 w-[10px] h-[2px] bg-gray-900 rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        ))}

        {/* 🧩 Render module slots */}
        {moduleSetup.map((type, index) => (
          <div
            key={index}
            className={moduleStyle}
            // Fallback: if Module doesn't call onOpen internally, clicking the wrapper will open it
            onClick={() => {
              // do not open empty slots
              if (!type) return;
              // call open
              handleModuleOpen(type);
            }}
          >
            <Module
              type={type}
              onSolve={handleModuleSolved}
              unlocked={buttonUnlocked}
              defused={defused}
              timerRunning={timerRunning}
              // new prop: allow Module to signal "open" (preferred)
              onOpen={() => {
                if (!type) return;
                handleModuleOpen(type);
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
