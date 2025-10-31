import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function FrontPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300);
  const [glitch, setGlitch] = useState(false);
  const audioRef = useRef(null);

  // 🎧 Play Valorant-style background sound
  useEffect(() => {
    const audio = new Audio("/sounds/valorant_bg.mp3"); 
    audio.loop = true;
    audio.volume = 0.4; 
    audio.play().catch(() => console.log("Autoplay blocked until user interacts"));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Glitch animation
  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);
    return () => clearInterval(glitchTimer);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen text-center text-white font-['Share_Tech_Mono'] 
      bg-[radial-gradient(ellipse_at_center,_#1a0000_0%,_#000_70%)] overflow-hidden"
      onClick={() => {
        // allow user-initiated playback if browser blocks autoplay
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play();
        }
      }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,transparent_2px,transparent_4px)] animate-scanline" />

      {/* Corners */}
      {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-[100px] h-[100px] border-[3px] border-yellow-400 opacity-70 drop-shadow-[0_0_8px_#facc15]
            ${pos === "top-left" ? "top-5 left-5 border-r-0 border-b-0" : ""}
            ${pos === "top-right" ? "top-5 right-5 border-l-0 border-b-0" : ""}
            ${pos === "bottom-left" ? "bottom-5 left-5 border-r-0 border-t-0" : ""}
            ${pos === "bottom-right" ? "bottom-5 right-5 border-l-0 border-t-0" : ""}
          `}
        />
      ))}

      {/* Alert Banner */}
      <div className="relative z-10 flex items-center justify-center gap-3 bg-[rgba(220,38,38,0.15)] border-2 border-red-600 px-8 py-3 mb-12 rounded-md animate-pulse-red shadow-[0_0_20px_rgba(220,38,38,0.3),inset_0_0_20px_rgba(220,38,38,0.1)]">
        <AlertTriangle className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_4px_#facc15]" />
        <span className="text-yellow-400 font-bold tracking-[3px] text-sm">
          SYSTEM ACTIVE
        </span>
        <AlertTriangle className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_4px_#facc15]" />
      </div>

      {/* Titles */}
      <div className="relative z-10 mb-12">
        <h1
          className={`text-[clamp(2.5rem,8vw,5rem)] font-black tracking-[2px] mb-4 transition-all duration-150 ${
            glitch
              ? "text-red-500 scale-105 drop-shadow-[2px_2px_0_#ff0000,-2px_-2px_0_#00ff00,4px_4px_15px_#ff0000]"
              : "text-white drop-shadow-[3px_3px_0_#dc2626,6px_6px_20px_rgba(220,38,38,0.6)]"
          }`}
        >
          KEEP SOLVING
        </h1>
        <h2 className="text-red-500 text-[clamp(1.5rem,4vw,2.5rem)] font-bold mb-4 tracking-[1px] drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
          AND NOBODY EXPLODES
        </h2>
        <p className="text-gray-400 text-[clamp(0.9rem,2vw,1.2rem)] tracking-[4px] mb-6">
          EVERY TICK COUNTS.
        </p>

        <div className="inline-block text-cyan-400 text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[8px] px-10 py-4 border-2 border-cyan-400 rounded-lg bg-[rgba(0,0,0,0.6)] shadow-[0_0_20px_rgba(34,211,238,0.4),inset_0_0_20px_rgba(34,211,238,0.1)]">
          {minutes}:{seconds}
        </div>
      </div>

      {/* Play Button */}
      <button
        onClick={() => {
          if (audioRef.current) audioRef.current.pause(); // stop music on navigation
          navigate("/rules");
        }}
        className="relative z-10 px-16 py-6 text-2xl font-extrabold tracking-[3px] text-white rounded-xl border-[4px] border-red-500 bg-gradient-to-br from-red-600 to-red-900 shadow-[0_8px_30px_rgba(220,38,38,0.4),inset_0_-2px_10px_rgba(0,0,0,0.3)] hover:scale-110 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(220,38,38,0.8),0_0_60px_rgba(250,204,21,0.4),inset_0_-2px_10px_rgba(0,0,0,0.3)] active:scale-105 transition-all duration-300 overflow-hidden group"
      >
        <span className="relative z-10">PLAY GAME</span>
        <span className="absolute inset-0 bg-white opacity-10 rounded-full scale-0 group-hover:scale-[15] transition-transform duration-700" />
      </button>

      {/* Credits */}
      <div className="relative z-10 mt-20 text-gray-500 text-xs tracking-wider leading-relaxed">
        <p className="text-gray-400 mb-2 tracking-[2px]">
          DEVELOPED BY TEAM ALPHA
        </p>
        <small className="text-gray-600">
          Shubhi Upadhayay • Snehashish Ghosh • Chirag Tuteja • Vaibhav Jain
        </small>
      </div>
    </div>
  );
}
