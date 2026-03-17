import React from "react";

interface H2Props {
  children: React.ReactNode;
  className?: string;
}

export default function ContainerSection({
  children,
  className = "",
}: H2Props) {
  return (
    <section
      className={`container mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-4 xl:pt-10 xl:pb-6  ${className}`}
    >
      {children}
    </section>
  );
}
