import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100","300","400","500","700","900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "ToeUp",
  description: "Ứng dụng học Toeic sử dụng AI để tạo Flashcard, luyện đề và gợi ý chiến lược học phù hợp với bạn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <Navbar01 />
          <main className="">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
