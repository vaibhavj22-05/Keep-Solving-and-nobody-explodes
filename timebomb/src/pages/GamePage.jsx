import React, { useEffect } from "react";
import Bomb from "../components/Bomb";

export default function GamePage() {
  useEffect(() => {
    // 🧨 Stop global background music if playing
    if (window.bgmAudio) {
      window.bgmAudio.pause();
      window.bgmAudio.currentTime = 0;
    }

    // 🎵 Start GamePage-specific music
    const gameBgm = new Audio("/sounds/spike.mp3");
    gameBgm.volume = 0.1;

    // Browser autoplay restrictions — wait for user interaction
    const startMusic = () => {
      gameBgm.play().catch(() => {});
      document.removeEventListener("click", startMusic);
    };
    document.addEventListener("click", startMusic, { once: true });

    // 🧹 Cleanup on exit
    return () => {
      gameBgm.pause();
      gameBgm.currentTime = 0;
    };
  }, []);

  return <Bomb />;
}
