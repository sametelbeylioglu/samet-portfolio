import type { Metadata } from "next";
import "./globals.css";
import { DynamicHead } from "@/components/dynamic-head";

export const metadata: Metadata = {
  title: {
    default: "Samet Elbeylioğlu | Portfolyo",
    template: "%s | Samet Elbeylioğlu",
  },
  description: "Samet Elbeylioğlu kişisel portfolyo sitesi - Projeler, blog yazıları, deneyimler ve iletişim",
  keywords: ["portfolyo", "Samet Elbeylioğlu", "web developer", "yazılım"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" style={{ background: "#000" }}>
      <body className="antialiased" style={{ background: "#000", color: "#f5f5f7" }}>
        <DynamicHead />
        {children}
      </body>
    </html>
  );
}
