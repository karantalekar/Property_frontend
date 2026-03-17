"use client";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
};

export default function PrimaryButton({
  children,
  loading = false,
  loadingText = "Please wait...",
  disabled = false,
  type = "submit",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full py-2.5 rounded-lg bg-[var(--primaryColor)] text-white font-medium
        hover:bg-[var(--primaryColor)] transition
        disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? loadingText : children}
    </button>
  );
}
