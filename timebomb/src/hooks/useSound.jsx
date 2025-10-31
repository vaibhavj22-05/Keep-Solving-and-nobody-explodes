import { useRef } from "react";

export default function useSound(src, { volume = 1 } = {}) {
  const audioRef = useRef(null);

  const play = () => {
    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.volume = volume;
      audioRef.current = audio;
    }

    audioRef.current.currentTime = 0; // restart sound each time
    audioRef.current.play().catch(() => {});
  };

  return { play };
}
