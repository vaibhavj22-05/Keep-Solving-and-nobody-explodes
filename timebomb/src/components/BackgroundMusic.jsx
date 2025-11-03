import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

let bgmAudio = null; // Persistent module audio

export default function BackgroundMusic() {
  const location = useLocation();

  useEffect(() => {
    if (!bgmAudio) {
      bgmAudio = new Audio("/sounds/valorant_bg.mp3");
      bgmAudio.loop = true;
      bgmAudio.volume = 0.01;

      // Expose globally for control elsewhere (like BombDiffused)
      window.bgmAudio = bgmAudio;

      const startMusic = () => {
        bgmAudio.play().catch(() => {});
        document.removeEventListener("click", startMusic);
      };
      document.addEventListener("click", startMusic, { once: true });
    }

    // Pause BGM on GamePage
    if (location.pathname === "/game") {
      bgmAudio.pause();
    } else {
      // Resume elsewhere
      bgmAudio.play().catch(() => {});
    }
  }, [location]);

  return null;
}
