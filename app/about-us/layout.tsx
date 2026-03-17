import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Regent Grove",
  description: "About Our Company",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
