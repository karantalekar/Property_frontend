"use client";

export function getLang() {
  if (typeof document === "undefined") return "en";

  const match = document.cookie.match(/lang=(ar|en)/);
  return match?.[1] ?? "en";
}
