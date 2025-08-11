import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emotion Tracker",
  description: "오늘 하루의 감정과 선택을 예쁘게 기록하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh`}
      >
        <div className="relative min-h-dvh">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.20)_0%,_transparent_60%)] blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,_rgba(236,72,153,0.18)_0%,_transparent_60%)] blur-3xl" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
