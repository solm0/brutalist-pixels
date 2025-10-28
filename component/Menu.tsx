'use client'

import { useEffect, useRef, useState } from "react";
import About from "./about";

function formatTime(sec: number) {
  if (isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function Menu({
  src,
  onTimeUpdate,
  lyric
}: {
  src: string;
  onTimeUpdate?: (time: number) => void;
  lyric: {kr: string, sr: string} | null;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrent(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [onTimeUpdate]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
  
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch (err) {
        alert("Safari에서 지원되지 않는 기능입니다😭");
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />

      {!hasStarted ? (
        <div className="fixed w-screen h-screen top-0 left-0 bg-[#0f0525] z-80  flex items-center justify-center ">
          <button
            onClick={() => {
              togglePlay();
              setHasStarted(true);
            }}
            className="underline underline-offset-4 hover:no-underline text-2xl"
          >
            Play
          </button>
        </div>
      ): (
        <div className="translate-y-56 absolute flex flex-col gap-4 w-auto h-auto items-center">
          <div
            className="text-sm h-auto items-center flex flex-col gap-0 shrink-0"
          >
            <p className="bg-[#0f0525] w-auto h-5 flex items-center">{lyric?.sr}</p>
            <p className="bg-[#0f0525] text-xs w-auto h-5 flex items-center">{lyric?.kr}</p>
          </div>
          
          {/* Audio */}
          <div className="h-8 px-3 text-xs flex gap-2 items-center font-mono bg-[#0f0525] border-b border-r border-[#fff7d8]">
            <button onClick={togglePlay} className="underline underline-offset-4 hover:no-underline">
              {playing ? "Pause" : "Play"}
            </button>

            <span>{formatTime(current)}</span>
            <span>/</span>
            <span>3:33</span>

            <button onClick={toggleMute} className="underline underline-offset-4 hover:no-underline">
              {muted ? "Unmute" : "Mute"}
            </button>
          </div>

          <About />
        </div>
      )}
    </>
  );
}