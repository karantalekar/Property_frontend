"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  videoUrl: string;
  title?: string;
  autoPlay?: boolean; // new prop to auto-play
  onPlay?: () => void; // callback when video starts
}

export default function PropertyVideo({
  videoUrl,
  title = "Property Video",
  autoPlay = false,
  onPlay,
}: Props) {
  const [playing, setPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto play when autoPlay prop changes
  useEffect(() => {
    if (autoPlay) {
      videoRef.current?.play();
      setPlaying(true);
    } else {
      videoRef.current?.pause();
      setPlaying(false);
    }
  }, [autoPlay]);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent parent click closing modal
    videoRef.current?.play();
    setPlaying(true);
    if (onPlay) onPlay();
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video">
      <video
        ref={videoRef}
        src={videoUrl}
        controls={playing}
        muted={!playing}
        playsInline
        className="w-full h-full object-contain"
        title={title}
      />

      {/* Play Button Overlay */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handlePlay}
        >
          <div className="relative z-10 flex items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              viewBox="0 0 24 24"
              className="w-12 h-12 ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}