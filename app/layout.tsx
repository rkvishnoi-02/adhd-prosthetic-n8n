import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anchor - ADHD Cognitive Prosthetic",
  description: "Your external executive brain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
