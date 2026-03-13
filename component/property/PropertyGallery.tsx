// components/PropertyGallery.tsx
"use client";

import { useState } from "react";
import { ImageIcon, Video } from "lucide-react";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAlt, setSelectedAlt] = useState<string>("");

  const getCategoryData = (catName: string) => {
    return galleryImages?.[catName] || { images: [], videos: [] };
  };

  const openModal = (image: string, alt: string) => {
    setSelectedImage(image);
    setSelectedAlt(alt);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedAlt("");
  };

  return (
    <>
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Property Gallery
        </h2>

        {categories.length === 0 ? (
          <p className="text-gray-500">No gallery images available.</p>
        ) : (
          <div className="space-y-12">
            {categories.map((categoryName) => {
              const data = getCategoryData(categoryName);
              const hasImages = data.images && data.images.length > 0;
              const hasVideos = data.videos && data.videos.length > 0;

              if (!hasImages && !hasVideos) return null;

              return (
                <div key={categoryName} className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                    {categoryName}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {hasImages &&
                      data.images.map((img, idx) => (
                        <div
                          key={`img-${idx}`}
                          className="relative aspect-square rounded-xl overflow-hidden shadow-sm cursor-pointer"
                          onClick={() =>
                            openModal(
                              `${BASE_URL}${img}`,
                              `${categoryName} Image ${idx + 1}`,
                            )
                          }
                        >
                          <img
                            src={`${BASE_URL}${img}`}
                            alt={`${categoryName} Image ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ))}

                    {hasVideos &&
                      data.videos.map((video, idx) => (
                        <div
                          key={`vid-${idx}`}
                          className="relative aspect-square rounded-xl overflow-hidden shadow-sm bg-black group"
                        >
                          <video
                            src={`${BASE_URL}${video}`}
                            controls
                            className="w-full h-full object-cover"
                            poster={`${BASE_URL}${data.images[0]}`}
                            // loading="lazy"
                          >
                            Your browser does not support the video tag.
                          </video>
                          <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">
                            <Video size={16} />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={closeModal}
        src={selectedImage || ""}
        alt={selectedAlt || ""}
      />
    </>
  );
}
