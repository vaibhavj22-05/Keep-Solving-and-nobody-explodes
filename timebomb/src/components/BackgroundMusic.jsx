// BackgroundMusic.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

let bgmAudio = null; // persistent across renders

export default function BackgroundMusic() {
  const location = useLocation();

  useEffect(() => {
    const excludedScreens = ["/game",'/exploded','/defused']; // 👈 routes where bgm should stop

    // Initialize BGM once
    if (!bgmAudio) {
      bgmAudio = new Audio("/sounds/valorant_bg.mp3");
      bgmAudio.loop = true;
      bgmAudio.volume = 0.05;
      bgmAudio.play().catch(() => {}); // avoid autoplay block
    }

    // Stop on excluded screens
    if (excludedScreens.includes(location.pathname)) {
      bgmAudio.pause();
      bgmAudio.currentTime = 0; // reset
    } else {
      if (bgmAudio.paused) {
        bgmAudio.play().catch(() => {});
      }
    }

    return () => {};
  }, [location.pathname]);

  return null;
}
