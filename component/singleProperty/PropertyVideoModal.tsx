"use client";

import { useEffect } from "react";
import PropertyVideo from "./PropertyVideo";
import { X } from "lucide-react";

interface Props {
  videoUrl: string;
  onClose: () => void;
  title?: string;
}

export default function PropertyVideoModal({
  videoUrl,
  onClose,
  title,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed h-full inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 bg-white p-2 z-50 hover:bg-gray-100 border-2 border-(--primaryColor) rounded-full"
      >
        <X size={20} className="text-(--primaryColor)" />
      </button>

      {/* Video player */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full container mx-auto px-4"
      >
        <PropertyVideo videoUrl={videoUrl} title={title} />
      </div>
    </div>
  );
}
