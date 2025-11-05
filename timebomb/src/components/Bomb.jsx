import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Module from "./modules/Module";
import useSound from "../hooks/useSound";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

export default function BombLayout() {
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

  const socketRef = useRef(null);
  const location = useLocation();
  const roomCode = location?.state?.roomCode;

  useEffect(() => {
    bgAudio.current = new Audio("/sounds/spike.mp3");
    bgAudio.current.loop = true;
    bgAudio.current.volume = 0.2;
    bgAudio.current.play().catch(() => {});
    return () => bgAudio.current?.pause();
  }, []);

  useEffect(() => {
    setModuleSetup(getModuleSetup());
  }, []);

  const handleModuleSolved = (name) => {
    setModulesSolved((prev) => ({ ...prev, [name]: true }));
  };

  useEffect(() => {
    if (!roomCode) return;

    const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected (diffuser):", socket.id);
      socket.emit("join-room", roomCode);
      socket.emit("choose-role", { roomCode, role: "diffuser" });
    });

    socket.on("error", (msg) => console.warn("Server error:", msg));

    socket.on("moduleAnswer", ({ roomCode: rc, moduleId, selectedAnswer }) => {
      if (rc !== roomCode) return;
      console.log("Received moduleAnswer:", moduleId, selectedAnswer);
      window.alert(`Expert answered for ${moduleId}: ${selectedAnswer}`);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomCode]);

  const handleModuleOpen = useCallback(
    (type) => {
      const moduleId = type === "wires" ? "wire" : type;

      if (!socketRef.current || !roomCode) {
        console.warn("Cannot open module, socket or roomCode missing");
        return;
      }

      console.log("Emitting moduleOpened ->", { roomCode, moduleId });
      socketRef.current.emit("moduleOpened", { roomCode, moduleId });
    },
    [roomCode]
  );

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
        {[ "top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2" ].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5 rounded-full bg-gradient-to-br from-gray-400 to-gray-800 border border-gray-900 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.4)]`}>
            <div className="absolute left-1/2 top-1/2 w-[10px] h-[2px] bg-gray-900 rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        ))}

        {moduleSetup.map((type, index) => (
          <div key={index} className={moduleStyle} onClick={() => type && handleModuleOpen(type)}>
            <Module
              type={type}
              onSolve={handleModuleSolved}
              unlocked={buttonUnlocked}
              defused={defused}
              timerRunning={timerRunning}
              onOpen={() => type && handleModuleOpen(type)}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
