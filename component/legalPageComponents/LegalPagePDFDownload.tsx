"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { LegalPageResult } from "@/types/legalPageTypes";
import { LegalPagePDF } from "./LegalPagePDF";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface LegalPagePDFDownloadProps {
  data: LegalPageResult;
}

export function LegalPagePDFDownload({ data }: LegalPagePDFDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const lang = useSelector((state: RootState) => state);
  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // Generate the PDF blob
      const blob = await pdf(<LegalPagePDF data={data} />).toBlob();

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.heading || "Terms-and-Conditions"}.pdf`;

      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      // console.error('Error generating PDF:', error);
      return error;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-white hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      disabled={isGenerating}
    >
      <Download size={16} />
      <span className="hidden md:inline">
        {isGenerating ? "Generating PDF..." : "Download PDF"}
      </span>
    </button>
  );
}
