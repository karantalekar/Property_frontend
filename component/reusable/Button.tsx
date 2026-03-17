import React from "react";
import Link from "next/link";
import { Language } from "@/config/locale";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  color?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  color,
  type = "button",
  disabled = false,
  className = "",
  href,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-1.5 sm:py-2.5 max-h-12 rounded-lg sm:text-sm md:text-xl font-normal transition-all duration-200 focus:outline-none";

  const defaultColor =
    "bg-[var(--primaryColor)] text-white hover:bg-white hover:text-[var(--primaryColor)] hover:border hover:border-[var(--primaryColor)]";

  const classes = `
    ${baseStyles}
    ${color ? color : defaultColor}
    ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {title}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {title}
    </button>
  );
};

export default Button;
