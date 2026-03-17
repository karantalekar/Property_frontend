"use client";

import { LegalPageResult } from "@/types/legalPageTypes";

interface LegalPageSidebarProps {
  data: LegalPageResult;
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export function LegalPageSidebar({
  data,
  activeSection,
  onSectionClick,
}: LegalPageSidebarProps) {
  return (
    <div className="sticky top-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
      <nav className="space-y-2">
        {data.points.map((term) => (
          <button
            key={`nav-${term.id}`}
            onClick={() => onSectionClick(`section-${term.id}`)}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-200 hover:bg-gray-200 ${
              activeSection === `section-${term.id}`
                ? "bg-gray-200 font-medium"
                : ""
            }`}
          >
            {term.sequence_number}. {term.heading}
          </button>
        ))}
      </nav>
    </div>
  );
}
