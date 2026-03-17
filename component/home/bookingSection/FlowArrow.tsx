// components/booking/FlowArrow.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface FlowArrowProps {
  rotate?: number;
  className?: string;
  isEven?: boolean;
}

export function FlowArrow({
  rotate = 0,
  className = "",
  isEven,
}: FlowArrowProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const finalRotate = isMobile ? 90 : rotate;

  const transformStyle = isMobile
    ? `rotate(${finalRotate}deg) scaleY(${isEven ? 1 : -1})`
    : `rotate(${finalRotate}deg) scale(var(--rtl-scale))`;

  return (
    <div
      className={`flex items-start justify-center md:justify-start pt-10 pb-10 md:pt-16 ${className}`}
      aria-hidden
      //   style={{
      //     transform: `scaleX(var(--rtl-scale-x))`,
      //     transformOrigin: "center",
      //   }}
    >
      <Image
        src="/booking/flow-arrow.png"
        alt="Flow Arrow"
        width={120}
        height={60}
        style={{
          transform: transformStyle,
          transition: "transform 0.3s ease",
        }}
        className="w-20 h-10 lg:w-auto lg:h-auto"
        priority={false}
      />
    </div>
  );
}
