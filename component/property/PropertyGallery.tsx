// "use client";

// import { useState } from "react";
// import { Video } from "lucide-react";
// import ImageModal from "./ImageModal";

// interface GalleryCategory {
//   id: number;
//   images: string[];
//   videos: string[];
// }

// interface PropertyGalleryProps {
//   categories: string[];
//   galleryImages: { [key: string]: GalleryCategory };
//   BASE_URL: string;
// }

// export default function PropertyGallery({
//   categories,
//   galleryImages,
//   BASE_URL,
// }: PropertyGalleryProps) {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [startIndex, setStartIndex] = useState(0);

//   const firstCategory = categories?.[0];
//   const data = galleryImages?.[firstCategory] || { images: [], videos: [] };

//   const images = data.images || [];
//   const videos = data.videos || [];

//   const mainImage = images[0];

//   const remainingImages = images.slice(1);

//   let previewImages: string[] = [];
//   let previewVideos: string[] = [];

//   if (videos.length === 0) {
//     previewImages = remainingImages.slice(0, 4);
//   } else if (videos.length === 1) {
//     previewVideos = videos.slice(0, 1);
//     previewImages = remainingImages.slice(0, 3);
//   } else {
//     previewVideos = videos.slice(0, 2);
//     previewImages = remainingImages.slice(0, 2);
//   }

//   const allGalleryItems = [
//     ...images.map((img) => ({
//       type: "image" as const,
//       src: `${BASE_URL}${img}`,
//       category: firstCategory,
//     })),
//     ...videos.map((vid) => ({
//       type: "video" as const,
//       src: `${BASE_URL}${vid}`,
//       category: firstCategory,
//     })),
//   ];

//   const openModal = (index: number) => {
//     setStartIndex(index);
//     setModalOpen(true);
//   };

//   return (
//     <>
//       <section className="space-y-6">
//         {/* GRID */}
//         <div className="grid grid-cols-4 gap-4 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[200px]">
//           {/* MAIN IMAGE */}
//           {mainImage && (
//             <div
//               className="col-span-4 md:col-span-2 row-span-2 rounded-2xl overflow-hidden cursor-pointer"
//               onClick={() => openModal(0)}
//             >
//               <img
//                 src={`${BASE_URL}${mainImage}`}
//                 className="w-full h-full object-cover hover:scale-105 transition duration-500"
//                 alt="main"
//               />
//             </div>
//           )}

//           {/* VIDEOS */}
//           {previewVideos.map((video, idx) => (
//             <div
//               key={`video-${idx}`}
//               className="relative rounded-xl overflow-hidden bg-black cursor-pointer"
//               onClick={() => openModal(images.length + idx)}
//             >
//               <video
//                 src={`${BASE_URL}${video}`}
//                 className="w-full h-full object-cover"
//                 muted
//               />
//               <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full">
//                 <Video size={16} />
//               </div>
//             </div>
//           ))}

//           {/* IMAGES */}
//           {previewImages.map((img, idx) => (
//             <div
//               key={`img-${idx}`}
//               className="rounded-xl overflow-hidden cursor-pointer"
//               onClick={() => openModal(idx + 1)}
//             >
//               <img
//                 src={`${BASE_URL}${img}`}
//                 className="w-full h-full object-cover hover:scale-105 transition duration-500"
//                 alt="gallery"
//               />
//             </div>
//           ))}
//         </div>

//         {/* SHOW MORE */}
//         {allGalleryItems.length > 5 && (
//           <div className="flex justify-end">
//             <button
//               onClick={() => openModal(0)}
//               className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//             >
//               Show More
//             </button>
//           </div>
//         )}
//       </section>

//       {/* MODAL */}
//       <ImageModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         items={allGalleryItems}
//         startIndex={startIndex}
//       />
//     </>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
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
  const remainingImages = images.slice(1);

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

  const allGalleryItems = [
    ...images.map((img) => ({
      type: "image" as const,
      src: `${BASE_URL}${img}`,
      category: firstCategory,
    })),
    ...videos.map((vid) => ({
      type: "video" as const,
      src: `${BASE_URL}${vid}`,
      category: firstCategory,
    })),
  ];

  const openModal = (index: number) => {
    setStartIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <section className="space-y-6">
        {/* GRID */}
        {/* <div className="grid grid-cols-4 gap-4 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[200px]"> */}
        <div className="grid grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[240px]">
          {/* MAIN IMAGE */}
          {mainImage && (
            <div
              className="col-span-4 md:col-span-2 row-span-2 rounded-2xl overflow-hidden cursor-pointer relative group"
              onClick={() => openModal(0)}
            >
              <Image
                src={`${BASE_URL}${mainImage}`}
                alt="main"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
            </div>
          )}

          {/* VIDEOS */}
          {previewVideos.map((video, idx) => (
            <div
              key={`video-${idx}`}
              className="relative rounded-xl overflow-hidden bg-black cursor-pointer group"
              onClick={() => openModal(images.length + idx)}
            >
              <video
                src={`${BASE_URL}${video}`}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />

              <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full">
                <Video size={16} />
              </div>
            </div>
          ))}

          {/* IMAGES */}
          {previewImages.map((img, idx) => (
            <div
              key={`img-${idx}`}
              className="rounded-xl overflow-hidden cursor-pointer relative group"
              onClick={() => openModal(idx + 1)}
            >
              <Image
                src={`${BASE_URL}${img}`}
                alt="gallery"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
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

      {/* MODAL */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        items={allGalleryItems}
        startIndex={startIndex}
      />
    </>
  );
}
