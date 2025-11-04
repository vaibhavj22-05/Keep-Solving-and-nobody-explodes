import React, { useEffect } from "react";

export default function BombExploded() {
  // 💥 Shake screen animation
  const shakeScreen = () => {
    const intensity = 10;
    const duration = 500;
    const body = document.body;
    const start = Date.now();

    const shake = () => {
      const elapsed = Date.now() - start;
      if (elapsed < duration) {
        const x = Math.random() * intensity - intensity / 2;
        const y = Math.random() * intensity - intensity / 2;
        body.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(shake);
      } else {
        body.style.transform = "";
      }
    };
    shake();
  };

  const restart = () => {
    // 🧹 Clear all data and restart
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const createSparks = () => {
    const container = document.querySelector(".spark-container");
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const spark = document.createElement("div");
      spark.classList.add("spark");
      spark.style.left = `${Math.random() * 100}%`;
      spark.style.top = `${Math.random() * 100}%`;
      spark.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(spark);
    }
  };

  useEffect(() => {
    // 🚨 Stop all previous sounds
    const stopAllAudio = () => {
      const audios = document.querySelectorAll("audio");
      audios.forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });
    };

    stopAllAudio();

    // 🔊 Play the endgame sound
    const victorySound = new Audio("/sounds/endgame.mp3");
    victorySound.volume = 0.7;
    victorySound.play().catch(() => {
      console.warn("Autoplay blocked — user interaction may be required.");
    });

    // 💥 Create sparks and shake
    createSparks();
    const interval = setInterval(shakeScreen, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-black text-red-500 font-mono">
      {/* Flash effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,0,0,0.8)_0%,rgba(0,0,0,0)_80%)] opacity-0 animate-[flash_2s_infinite]" />

      <div className="spark-container absolute inset-0 z-10 overflow-hidden"></div>

      <h1 className="text-6xl font-extrabold uppercase tracking-widest text-red-500 animate-[flicker_0.1s_infinite,glow_2s_infinite] z-20">
        💥 Bomb Exploded!
      </h1>
      <p className="mt-4 text-red-300 text-xl z-20">
        Mission failed. Try again next time.
      </p>

      <button
        onClick={restart}
        className="mt-8 px-8 py-3 bg-red-700 text-white text-lg rounded-lg shadow-lg hover:bg-red-600 hover:scale-110 transition-all z-20"
      >
        Return to Home
      </button>

      {/* Custom Tailwind keyframes */}
      <style>
        {`
          @keyframes glow {
            0% { text-shadow: 0 0 10px #ff0000, 0 0 20px #ff3333, 0 0 40px #ff0000; }
            50% { text-shadow: 0 0 25px #ff1a1a, 0 0 50px #ff0000, 0 0 80px #ff0000; }
            100% { text-shadow: 0 0 10px #ff0000, 0 0 20px #ff3333, 0 0 40px #ff0000; }
          }

          @keyframes flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
            20%, 24%, 55% { opacity: 0.4; }
          }

          @keyframes flash {
            0%, 90%, 100% { opacity: 0; }
            20% { opacity: 0.8; }
            21% { opacity: 0; }
          }

          .spark {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ff0000;
            box-shadow: 0 0 10px 2px #ff0000;
            border-radius: 50%;
            opacity: 0;
            animation: spark 1.5s infinite;
          }

          @keyframes spark {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-200px) scale(0.5); }
          }
        `}
      </style>
    </div>
  );
}
