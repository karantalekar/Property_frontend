"use client";

import { BlogTypes } from "@/types/blogsDataType";

interface BlogTabsProps {
  labels: any[];
  activeLabel: number;
  onTabChange: (labelId: number) => void;
}

export default function BlogTabs({
  labels,
  activeLabel,
  onTabChange,
}: BlogTabsProps) {
  return (
    <div
      className="
        flex flex-nowrap whitespace-nowrap gap-2 mb-10 
        justify-start 
        md:justify-center
        overflow-x-auto 
        scrollbar-hide
        px-2
      "
    >
      {labels.map((label) => (
        <button
          key={label.id}
          onClick={() => onTabChange(label.id)}
          className={`
            px-6 py-2 rounded-md 
            transition-colors duration-500 ease-in-out
            ${
              activeLabel === label.id
                ? "bg-teal-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }
          `}
        >
          {label.label}
        </button>
      ))}
    </div>
  );
}
