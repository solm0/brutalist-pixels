'use client'

import About from "@/component/about";
import Menu from "@/component/Menu";
import AudioPlayer from "@/component/Menu";
import { Lyrics } from "@/data/lyrics";
import { Monuments } from "@/data/monuments";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const asciiRef = useRef<HTMLPreElement>(null);

  const chars = "  .,-+:;ьгпозвфщж";

  function getChar(brightness: number) {
    const index = Math.floor((brightness / 255) * (chars.length - 1));
    return chars[index];
  }

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ascii = asciiRef.current;
    if (!img || !canvas || !ascii) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let zoom = 10;
    let frameId: number;

    function frameToAscii() {
      if (!img || !canvas || !ascii || !ctx) return;

      const baseWidth = (img.naturalWidth || 1200) / 6;
      const baseHeight = (img.naturalHeight || 1200) / 12;

      canvas.width = baseWidth;
      canvas.height = baseHeight;

      // zoom increases gradually
      zoom -= 0.01; // adjust speed here

      const drawW = baseWidth * zoom;
      const drawH = baseHeight * zoom;
      const offsetX = (img.naturalWidth - drawW) / 2;
      const offsetY = (img.naturalHeight - drawH) / 2;

      ctx.drawImage(
        img,
        offsetX, offsetY, drawW, drawH, // source rect (zoomed crop)
        0, 0, canvas.width, canvas.height // destination rect
      );

      const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let output = "";
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const r = data[i], g = data[i+1], b = data[i+2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          output += getChar(brightness);
        }
        output += "\n";
      }

      ascii.textContent = output;
      frameId = requestAnimationFrame(frameToAscii);
    }

    frameToAscii();

    // change src every 5s
    let idx = 0;
    const interval = setInterval(() => {
      idx = Math.floor(Math.random() * Monuments.length);
      if (img) {
        img.src = Monuments[idx].filename;
      }
      zoom = 10; // reset zoom each image
    }, 8000);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(interval);
    };
  }, []);

  
  const [lyric, setLyric] = useState<{kr: string, sr: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    }
  }, [])

  // 가사 싱크 맞추기
  useEffect(() => {
    console.log('currentTime', currentTime)
    const current = Lyrics.findLast(l => 
      (l.time ?? 99) <= currentTime
    );
    if (current) {
      setLyric(current.lyric);
      console.log('lyric', lyric)
    } else {
      setLyric(null)
    }
  }, [currentTime]);

  return (
    <div className="w-screen h-screen font-sans flex items-center justify-items-center">
      <main className="w-full h-full text-[#fff7d8] font-mono flex justify-center items-center">
        
        {/* 그래픽 */}
        <img
          ref={imgRef}
          className="absolute w-20 left-0 top-1/2 -translate-y-1/2 hidden"
          src="/the-freedom-hill-monument.webp"
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <pre
          className="top-0 left-0 leading-2 tracking-widest text-xs bg-[#0f0525]"
          ref={asciiRef}
        />

        {/* 메뉴 */}
        <Menu src="/los-je-dan.mp3" onTimeUpdate={setCurrentTime} lyric={lyric} />
      </main>
    </div>
  );
}