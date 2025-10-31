import { useEffect, useRef } from "react";

export default function useBackgroundMusic(src, volume = 0.5) {
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element once
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Try autoplay (some browsers need interaction)
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.warn("Autoplay blocked, waiting for user interaction");
        const resume = () => {
          audio.play();
          document.removeEventListener("click", resume);
        };
        document.addEventListener("click", resume);
      }
    };

    playAudio();

    return () => {
      audio.pause();
    };
  }, [src, volume]);

  return audioRef;
}
