"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Video } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: { type: "image" | "video"; src: string; category?: string }[];
  startIndex?: number;
}

export default function ImageModal({
  isOpen,
  onClose,
  items,
  startIndex = 0,
}: ImageModalProps) {
  const [current, setCurrent] = useState(startIndex);
  const next = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const currentItem = items[current];
  useEffect(() => {
    setCurrent(startIndex);
  }, [startIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* CLOSE BUTTON */}
      <button className="absolute top-6 right-6 text-white" onClick={onClose}>
        <X size={32} />
      </button>

      {/* LEFT BUTTON */}
      <button className="absolute left-6 text-white" onClick={prev}>
        <ChevronLeft size={40} />
      </button>

      {/* RIGHT BUTTON */}
      <button className="absolute right-6 text-white" onClick={next}>
        <ChevronRight size={40} />
      </button>

      {/* CONTENT */}
      <div className="max-w-6xl max-h-[85vh] relative">
        {/* CATEGORY BADGE */}
        {currentItem.category && (
          <div className="absolute top-0  bg-[#8CA9FF] text-white px-4 py-2 rounded-br-lg font-semibold text-xl z-10">
            {currentItem.category}
          </div>
        )}
        {currentItem.type === "image" ? (
          <img src={currentItem.src} className="max-h-[85vh] object-contain" />
        ) : (
          <video
            src={currentItem.src}
            controls
            autoPlay
            className="max-h-[85vh]"
          />
        )}
      </div>

      {/* COUNTER */}
      <div className="absolute bottom-6 text-white text-sm">
        {current + 1} / {items.length}
      </div>
    </div>
  );
}
