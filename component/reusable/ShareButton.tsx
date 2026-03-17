"use client";

import { Copy, Facebook, ShareIcon, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  url?: string;
  lang?: string;
  className?: string;
}

export default function ShareButton({
  title,
  url,
  lang = "en",
  className = "",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
    setOpen(false);
  };

  const openShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`p-2 rounded-full shadow transition bg-white hover:bg-gray-100 ${
          open ? "bg-[#FDF1E6] border border-[var(--primaryColor)]" : ""
        }`}
        aria-label="Share"
      >
        <ShareIcon size={18} className="text-gray-500" />
      </button>

      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          {/* Share Popup */}
          <div
            className={`absolute z-20 mt-2 ${
              lang === "en" ? "right-0" : "left-0"
            } bg-white border rounded-xl shadow-lg p-3`}
          >
            <div className="flex items-center gap-3">
              {/* Copy */}
              <button
                onClick={copyLink}
                className="p-2 rounded-full text-zinc-600 bg-gray-100 hover:bg-gray-200"
                title="Copy link"
              >
                <Copy size={18} />
              </button>

              {/* WhatsApp */}
              <button
                onClick={() =>
                  openShare(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `${title} - ${shareUrl}`,
                    )}`,
                  )
                }
                className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center"
                title="WhatsApp"
              >
                <Image src="/wa.png" alt="WhatsApp" width={22} height={22} />
              </button>

              {/* Facebook */}
              <button
                onClick={() =>
                  openShare(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl,
                    )}`,
                  )
                }
                className="p-2 rounded-full bg-[#1877F2]/10 text-[#1877F2]"
                title="Facebook"
              >
                <Facebook size={18} />
              </button>

              {/* X / Twitter */}
              <button
                onClick={() =>
                  openShare(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl,
                    )}&text=${encodeURIComponent(title)}`,
                  )
                }
                className="p-2 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2]"
                title="X"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
