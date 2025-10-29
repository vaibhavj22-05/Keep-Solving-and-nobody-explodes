import React from "react";
import { motion } from "framer-motion";

export default function TimerModule() {
  return (
    <div className="flex flex-col justify-center items-center">
      <motion.div
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="bg-black border-[3px] border-gray-800 rounded-lg px-8 py-4 text-red-500 text-6xl font-mono tracking-widest shadow-[inset_0_0_20px_rgba(255,0,0,0.4),0_0_20px_rgba(255,0,0,0.3)] text-center"
      >
        02:35
      </motion.div>
      <div className="mt-3 flex gap-2">
        <div className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_4px_rgba(255,0,0,0.5)]"></div>
        <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
        <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
}
