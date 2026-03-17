import React from "react";

interface H2Props {
  children: React.ReactNode;
  className?: string;
}

export default function Heading2({ children, className = "" }: H2Props) {
  return (
    <h2
      className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl lg:leading-[1.15] font-normal text-black ${className}`}
    >
      {children}
    </h2>
  );
}
