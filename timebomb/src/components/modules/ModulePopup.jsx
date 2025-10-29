// components/modules/ModulePopup.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ModulePopup({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="relative bg-gradient-to-b from-[#22262b] to-[#1a1d20] border border-gray-700 rounded-2xl p-6 shadow-2xl w-[580px]"
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl font-bold"
            >
              ✖
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
