"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Video as VideoIcon } from "lucide-react";
import GallerySlider from "./GallerySlider";

interface CategoryGallery {
  images: string[];
  videos?: string[];
}

interface Props {
  categories: Record<string, CategoryGallery>;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onClose: () => void;
}

// Image slide
function ImageSlide({ url, onClick }: { url: string; onClick: () => void }) {
  return (
    <div
      className="break-inside-avoid mb-4 overflow-hidden relative cursor-pointer hover:brightness-95 transition"
      onClick={onClick}
    >
      <Image
        src={url}
        alt="Gallery Image"
        width={500}
        height={500}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </div>
  );
}

// Video slide with thumbnail
function VideoSlide({ thumbnailUrl, onClick }: { thumbnailUrl: string; onClick: () => void }) {
  return (
    <div
      className="break-inside-avoid mb-4  overflow-hidden relative cursor-pointer hover:brightness-95 transition aspect-video"
      onClick={onClick}
    >
      <Image
        src={thumbnailUrl}
        alt="Video Thumbnail"
        fill
        style={{ objectFit: "cover" }}
        className=""
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40">
        <VideoIcon className="h-12 w-12" />
        <span className="ml-2 text-sm">Watch Video</span>
      </div>
    </div>
  );
}

export default function GalleryMasonryModal({
  categories,
  activeCategory,
  setActiveCategory,
  onClose,
}: Props) {
  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderStartIndex, setSliderStartIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const activeGallery = categories[activeCategory] || { images: [], videos: [] };

  // Build slides: images first, then videos
  const slides = [
    ...activeGallery.images.map((url) => ({
      type: "image" as const,
      url,
      category: activeCategory,
    })),
    ...(activeGallery.videos?.map((url) => ({
      type: "video" as const,
      url,
      thumbnail: activeGallery.images[0] || "/placeholder.png",
      category: activeCategory,
    })) || []),
  ];

  const handleItemClick = (index: number) => {
    setSliderStartIndex(index);
    setSliderOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-black/95 flex flex-col items-center overflow-auto transition-opacity duration-300">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 p-1 rounded-full bg-white hover:bg-gray-100 transition-colors close-button"
      >
        <X size={24} className="text-(--primaryColor)" />
      </button>

      {/* Category Tabs - only real categories */}
      {Object.keys(categories).length > 1 && (
        <div className="flex gap-4 mt-16 mb-4 z-50 flex-wrap justify-center">
          {Object.keys(categories).map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded font-medium text-sm ${
                cat === activeCategory
                  ? "bg-(--primaryColor) text-white shadow-lg"
                  : "bg-white text-(--primaryColor) hover:bg-(--secondaryColor)"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveCategory(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Grid */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full flex-1 overflow-auto px-4 md:px-8 py-4 gallery-scroll"
      >
        <div
          className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4 space-y-4"
          style={{ columnGap: "1rem" }}
        >
          {slides.map((slide, i) =>
            slide.type === "image" ? (
              <ImageSlide key={i} url={slide.url} onClick={() => handleItemClick(i)} />
            ) : (
              <VideoSlide
                key={i}
                thumbnailUrl={slide.thumbnail}
                onClick={() => handleItemClick(i)}
              />
            )
          )}
        </div>
      </div>

      {/* Slider Modal */}
      {sliderOpen && (
        <GallerySlider
          slides={slides}
          initialSlide={sliderStartIndex}
          onClose={() => setSliderOpen(false)}
          category={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}

      <style jsx>{`
        .close-button {
          border: 2px solid #82604d;
          color: #82604d;
          transition: all 0.2s;
        }
        .close-button:hover {
          background: #82604d;
          color: #fff;
        }
        .gallery-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .gallery-scroll::-webkit-scrollbar-track {
          background: #111;
        }

        .gallery-scroll::-webkit-scrollbar-thumb {
          background: #82604d;
          border-radius: 10px;
        }

        .gallery-scroll::-webkit-scrollbar-thumb:hover {
          background: #6b4f3f;
        }
      `}</style>
    </div>
  );
}