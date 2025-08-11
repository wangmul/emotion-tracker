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
          <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/50 bg-white/70 dark:bg-black/30 border-b border-white/20">
            <div className="mx-auto flex h-12 sm:h-14 max-w-5xl items-center justify-between px-3 sm:px-6">
              <a href="/" className="text-sm font-medium text-black/80 dark:text-white/90 hover:opacity-80 transition-opacity">
                Emotion Tracker
              </a>
              <nav className="flex items-center gap-2 sm:gap-3 text-sm">
                <a href="/record/step-1" className="rounded-md px-3 py-1.5 hover:bg-black/[.04] active:scale-[0.99] dark:hover:bg-white/10">기록하기</a>
                <a href="/history" className="rounded-md px-3 py-1.5 hover:bg-black/[.04] active:scale-[0.99] dark:hover:bg-white/10">히스토리</a>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
