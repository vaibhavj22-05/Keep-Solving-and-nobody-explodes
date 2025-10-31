import React, { useEffect } from "react";

export default function BombDiffused() {
  // Stop all currently playing sounds and play the victory one
  useEffect(() => {
    // Stop all other sounds
    const stopAllAudio = () => {
      const audios = document.querySelectorAll("audio");
      audios.forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });
    };

    stopAllAudio();

    // Play the endgame sound
    const victorySound = new Audio("/sounds/endgame.mp3");
    victorySound.volume = 0.7;
    victorySound.play().catch(() => {
      console.warn("Autoplay blocked — user interaction may be required.");
    });

    // Subtle pulse glow every 2s
    const pulseScreen = () => {
      const body = document.body;
      body.style.transition = "background 0.5s ease";
      body.style.background =
        "radial-gradient(circle at center, #0f0 0%, #000 90%)";
      setTimeout(() => (body.style.background = ""), 500);
    };

    const interval = setInterval(pulseScreen, 2000);

    // Floating particles
    const container = document.querySelector(".particle-container");
    if (container) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(particle);
      }
    }

    return () => {
      clearInterval(interval);
      victorySound.pause();
      victorySound.currentTime = 0;
    };
  }, []);

  const restart = () => {
    window.location.href = "/";
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-black text-green-400 font-mono">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,0,0.3)_0%,rgba(0,0,0,0)_80%)] opacity-0 animate-[glowpulse_3s_infinite]" />
      <div className="particle-container absolute inset-0 z-10 overflow-hidden"></div>

      <h1 className="text-6xl font-extrabold uppercase tracking-widest text-green-400 animate-[flicker_0.15s_infinite,successglow_2s_infinite] z-20">
        ✅ Bomb Diffused!
      </h1>
      <p className="mt-4 text-green-300 text-xl z-20">
        Excellent work, Agent. The world is safe... for now.
      </p>
      <button
        onClick={restart}
        className="mt-8 px-8 py-3 bg-green-700 text-white text-lg rounded-lg shadow-lg hover:bg-green-600 hover:scale-110 transition-all z-20"
      >
        Return to Home
      </button>

      {/* Custom animations */}
      <style>
        {`
          @keyframes successglow {
            0% { text-shadow: 0 0 10px #00ff00, 0 0 20px #00cc00, 0 0 40px #00ff00; }
            50% { text-shadow: 0 0 25px #33ff33, 0 0 50px #00ff00, 0 0 80px #00ff00; }
            100% { text-shadow: 0 0 10px #00ff00, 0 0 20px #00cc00, 0 0 40px #00ff00; }
          }

          @keyframes flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
            20%, 24%, 55% { opacity: 0.6; }
          }

          @keyframes glowpulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.6; }
          }

          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00ff00;
            box-shadow: 0 0 10px 2px #00ff00;
            border-radius: 50%;
            opacity: 0;
            animation: float 2s infinite ease-in-out;
          }

          @keyframes float {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-200px) scale(0.5); }
          }
        `}
      </style>
    </div>
  );
}
