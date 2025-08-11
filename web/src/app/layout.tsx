import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} antialiased min-h-dvh`}
      >
        <div className="relative min-h-dvh">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 -left-24 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,_rgba(147,197,253,0.14)_0%,_transparent_65%)] blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(196,181,253,0.12)_0%,_transparent_65%)] blur-3xl" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
