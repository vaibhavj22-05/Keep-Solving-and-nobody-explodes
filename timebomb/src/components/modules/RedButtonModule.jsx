import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RedButtonModule({ onDisarm }) {
  const [screenRemoved, setScreenRemoved] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [allModulesSolved, setAllModulesSolved] = useState(false);

  const [removeSound] = useState(new Audio("/sounds/screen_whoosh.mp3"));
  const [disarmSound] = useState(new Audio("/sounds/disarm.mp3"));

  // 🔍 Check localStorage for all module statuses
  useEffect(() => {
    const checkModules = () => {
      const modules = [
        "wires_moduleStatus",
        "chemical_moduleStatus",
      ];

      const allSolved = modules.every(
        (key) => localStorage.getItem(key) === "defused"
      );
      setAllModulesSolved(allSolved);
    };

    // Run initially + periodically check
    checkModules();
    const interval = setInterval(checkModules, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🧊 Remove translucent screen when all modules are solved
  useEffect(() => {
    if (allModulesSolved && !screenRemoved) {
      removeSound.play();
      const delay = setTimeout(() => setScreenRemoved(true), 1000);
      return () => clearTimeout(delay);
    }
  }, [allModulesSolved, screenRemoved, removeSound]);

  // 🟥 Handle button press to disarm
  const handlePress = () => {
    if (!screenRemoved || pressed) return;
    setPressed(true);
    disarmSound.play();

    // Store final defused state globally
    localStorage.setItem("final_defuse", "true");

    onDisarm?.(); // callback to stop timer, trigger confetti, etc.
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative flex justify-center items-center">
        {/* 🔒 Translucent glass screen */}
        <AnimatePresence>
          {!screenRemoved && (
            <motion.div
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: 120, y: -80, rotate: 25 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute w-40 h-40 rounded-full 
                         bg-[rgba(255,255,255,0.15)] backdrop-blur-sm 
                         border border-[rgba(255,255,255,0.4)]
                         z-20 shadow-[0_0_20px_rgba(255,255,255,0.25)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.2)] to-transparent rounded-full"></div>
              <div className="absolute inset-0 animate-pulse opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3),transparent_70%)]"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🟥 Red button */}
        <motion.button
          whileTap={{ scale: screenRemoved && !pressed ? 0.9 : 1 }}
          animate={{
            scale: screenRemoved && !pressed ? [1, 1.05, 1] : 1,
            boxShadow: screenRemoved
              ? "0 0 30px rgba(255,0,0,0.6), 0 0 70px rgba(255,0,0,0.3)"
              : "0 0 10px rgba(100,0,0,0.3)",
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={handlePress}
          disabled={!screenRemoved || pressed}
          className={`relative w-40 h-40 rounded-full border-[4px] border-red-800
            bg-gradient-to-br from-[#ff4d4d] to-[#a70000]
            shadow-[inset_0_4px_8px_rgba(255,255,255,0.3),0_8px_25px_rgba(255,0,0,0.5)]
            flex items-center justify-center
            ${pressed ? "opacity-70 scale-95" : ""}
          `}
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_70%)] rounded-full"></span>
          <span className="relative text-white font-bold text-2xl tracking-widest select-none">
            {pressed ? "DEFUSED" : "PRESS"}
          </span>
        </motion.button>
      </div>

      {/* 🧠 Status text */}
      <div className="mt-5 text-sm text-gray-300 font-mono tracking-wider">
        {allModulesSolved
          ? screenRemoved
            ? "🔓 SYSTEM UNLOCKED"
            : "✅ All modules defused..."
          : "🔒 Waiting for modules..."}
      </div>
    </div>
  );
}
