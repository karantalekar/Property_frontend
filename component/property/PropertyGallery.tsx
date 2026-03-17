"use client";

import { useState } from "react";
import { Video } from "lucide-react";
import ImageModal from "./ImageModal";

interface GalleryCategory {
  id: number;
  images: string[];
  videos: string[];
}

interface PropertyGalleryProps {
  categories: string[];
  galleryImages: { [key: string]: GalleryCategory };
  BASE_URL: string;
}

export default function PropertyGallery({
  categories,
  galleryImages,
  BASE_URL,
}: PropertyGalleryProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const firstCategory = categories?.[0];
  const data = galleryImages?.[firstCategory] || { images: [], videos: [] };

  const images = data.images || [];
  const videos = data.videos || [];

  const mainImage = images[0];

  /* remove main image from preview list */
  const remainingImages = images.slice(1);

  /* decide preview layout */
  let previewImages: string[] = [];
  let previewVideos: string[] = [];

  if (videos.length === 0) {
    previewImages = remainingImages.slice(0, 4);
  } else if (videos.length === 1) {
    previewVideos = videos.slice(0, 1);
    previewImages = remainingImages.slice(0, 3);
  } else {
    previewVideos = videos.slice(0, 2);
    previewImages = remainingImages.slice(0, 2);
  }

  /* modal gallery items */
  const allGalleryItems = [
    ...images.map((img) => ({
      type: "image" as const,
      src: `${BASE_URL}${img}`,
    })),
    ...videos.map((vid) => ({
      type: "video" as const,
      src: `${BASE_URL}${vid}`,
    })),
  ];

  const openModal = (index: number) => {
    setStartIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <section className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {/* MAIN IMAGE */}
          {mainImage && (
            <div
              className="col-span-4 md:col-span-2 row-span-2 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => openModal(0)}
            >
              <img
                src={`${BASE_URL}${mainImage}`}
                className="w-full md:h-[680] object-cover hover:scale-105 transition duration-500"
              />
            </div>
          )}

          {/* VIDEOS */}
          {previewVideos.map((video, idx) => (
            <div
              key={`video-${idx}`}
              className="relative rounded-xl overflow-hidden bg-black cursor-pointer"
              onClick={() => openModal(images.length + idx)}
            >
              <video
                src={`${BASE_URL}${video}`}
                className="w-full md:h-[305] h-30 object-cover"
                muted
              />
              <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full">
                <Video size={16} />
              </div>
            </div>
          ))}

          {/* IMAGES */}
          {previewImages.map((img, idx) => (
            <div
              key={`img-${idx}`}
              className="rounded-xl overflow-hidden cursor-pointer"
              onClick={() => openModal(idx + 1)}
            >
              <img
                src={`${BASE_URL}${img}`}
                className="w-full md:h-[330] h-[120] object-cover hover:scale-105 transition duration-500"
              />
            </div>
          ))}
        </div>

        {/* SHOW MORE */}
        {allGalleryItems.length > 5 && (
          <div className="flex justify-end">
            <button
              onClick={() => openModal(0)}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Show More
            </button>
          </div>
        )}
      </section>

      {/* FULL GALLERY MODAL */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        items={allGalleryItems}
        startIndex={startIndex}
      />
    </>
  );
}
