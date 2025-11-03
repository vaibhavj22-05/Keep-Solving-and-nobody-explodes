import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TimerModule() {
  const [time, setTime] = useState(300); // 5 minutes
  const [exploded, setExploded] = useState(false);
  const controls = useAnimation();
  const explosionSoundRef = useRef(null);
  const navigate = useNavigate();

  // Timer countdown
  useEffect(() => {
    if (time <= 0) return;
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [time]);

  // Handle shaking, explosion, and redirection
  useEffect(() => {
    if (time <= 5 && time > 0) {
      controls.start({
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.3, repeat: Infinity, ease: "easeInOut" },
      });
    } else {
      controls.stop();
      controls.set({ x: 0 });
    }

    // Explosion trigger
    if (time === 0 && !exploded) {
      setExploded(true);
      if (explosionSoundRef.current) {
        explosionSoundRef.current.play();
      }

      // Redirect after 5 seconds
      setTimeout(() => {
        navigate("/exploded");
      }, 5000);
    }
  }, [time, controls, exploded, navigate]);

  const formatTime = (t) => {
    const m = String(Math.floor(t / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <motion.div
      animate={{
        backgroundColor: exploded
          ? ["#000000", "#ff0000", "#000000"]
          : ["#0a0a0a", "#1a1a1a"],
      }}
      transition={{
        duration: exploded ? 0.8 : 2,
        repeat: exploded ? 3 : Infinity,
        ease: "easeInOut",
      }}
      className="w-full h-full flex flex-col justify-center items-center border-4 border-gray-800 rounded-xl shadow-[inset_0_0_30px_rgba(255,0,0,0.3),0_0_25px_rgba(255,0,0,0.5)] p-6 relative"
    >
      {/* Hidden explosion sound */}
      <audio ref={explosionSoundRef} src="/sounds/explosion.mp3" preload="auto" />

      <motion.div animate={controls} className="flex flex-col items-center">
        <motion.div
          animate={{
            opacity:
              time <= 5
                ? [1, 0.1, 1] // Faster blink when close to explosion
                : [1, 0.6, 1],
            scale: exploded ? [1, 1.3, 0.8, 1] : 1,
          }}
          transition={{
            duration: time <= 5 ? 0.3 : 1.2,
            repeat: exploded ? 2 : Infinity,
          }}
          className={`text-center text-7xl font-mono tracking-widest select-none rounded-md px-10 py-6 border-[3px] border-gray-700 bg-black shadow-[inset_0_0_40px_rgba(255,0,0,0.5),0_0_25px_rgba(255,0,0,0.4)] ${
            time <= 5
              ? "text-red-600"
              : time <= 10
              ? "text-yellow-400"
              : "text-red-500"
          }`}
        >
          {formatTime(time)}
        </motion.div>

        <div className="mt-5 flex gap-3">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{
              duration: time <= 5 ? 0.4 : 0.8,
              repeat: Infinity,
            }}
            className={`w-4 h-4 rounded-full shadow-[0_0_15px_5px_rgba(255,0,0,0.5)] ${
              time <= 5
                ? "bg-red-700"
                : time <= 10
                ? "bg-yellow-400"
                : "bg-red-600"
            }`}
          ></motion.div>
          <div className="w-4 h-4 bg-gray-700 rounded-full shadow-inner"></div>
          <div className="w-4 h-4 bg-gray-700 rounded-full shadow-inner"></div>
        </div>
      </motion.div>

      {/* Explosion visual pulse */}
      {exploded && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 3, 6], opacity: [1, 0.8, 0] }}
          transition={{ duration: 1.5 }}
          className="absolute w-48 h-48 rounded-full bg-red-600 blur-3xl"
        ></motion.div>
      )}
    </motion.div>
  );
}
