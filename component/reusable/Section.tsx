import React from "react";

interface H2Props {
  children: React.ReactNode;
  className?: string;
}

export default function Section({ children, className = "" }: H2Props) {
  return <section className={`${className}`}>{children}</section>;
}
