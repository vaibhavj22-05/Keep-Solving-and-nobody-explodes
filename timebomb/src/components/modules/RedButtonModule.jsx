import React from "react";
import { motion } from "framer-motion";

export default function RedButtonModule() {
  return (
    <div className="flex flex-col justify-center items-center">
      <motion.button
        whileTap={{ scale: 0.92 }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative w-32 h-32 rounded-full border-[4px] border-red-800 
                    bg-gradient-to-br from-[#ff4d4d] to-[#a70000]
                    shadow-[inset_0_4px_8px_rgba(255,255,255,0.3),0_8px_25px_rgba(255,0,0,0.5),0_4px_10px_rgba(0,0,0,0.8)]"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_70%)] rounded-full"></span>
        <span className="relative text-white font-bold text-xl tracking-widest">
          PRESS
        </span>
      </motion.button>
    </div>
  );
}
