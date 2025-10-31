import React, { useEffect } from "react";
import Bomb from "../components/Bomb";

export default function GamePage() {
  useEffect(() => {
    const gameBgm = new Audio("/sounds/spike.mp3"); // 🎵 Your GamePage BGM file
    gameBgm.volume = 0.4;

    // Browser autoplay restrictions — wait for a user click
    const startMusic = () => {
      gameBgm.play().catch(() => {});
      document.removeEventListener("click", startMusic);
    };
    document.addEventListener("click", startMusic, { once: true });

    // Cleanup when leaving page (stop & reset music)
    return () => {
      gameBgm.pause();
      gameBgm.currentTime = 0;
    };
  }, []);

  return <Bomb />;
}
