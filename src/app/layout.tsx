import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";

export const metadata: Metadata = {
  title: "Raago - Norsk Prediksjonsmarked",
  description:
    "Norges forste prediksjonsmarked. Handel pa politikk, energi, sport, vaer og mer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body className="antialiased">
        <Suspense
          fallback={
            <nav className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/80" />
          }
        >
          <NavbarWrapper />
        </Suspense>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
