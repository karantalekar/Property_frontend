import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Do - Regent Grove",
  description: "What We Do",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
