import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sıfır Atık Hub | Yapay Zeka Destekli Oyunlaştırma",
  description:
    "Sıfır Atık Vakfı için Yapay Zeka Destekli Okullar Arası Oyunlaştırma MVP prototipi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
