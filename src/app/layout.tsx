import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BLACKTASTE® — Bitter by Nature. Bold by Design.",
  description: "An experimental digital coffee experience for BLACKTASTE Americano.",
  metadataBase: new URL("https://blacktaste.example"),
  openGraph: {
    title: "BLACKTASTE®",
    description: "Bitter by Nature. Bold by Design.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
