import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import LiveSalesToast from "@/components/LiveSalesToast";
import Footer from "@/components/Footer";
import ContactWidget from "@/components/ContactWidget"; // <-- Gọi Nút Liên Hệ

export const metadata: Metadata = {
  title: "The Van PUBG - Bán Acc VIP",
  description: "Hệ thống giao dịch Acc PUBG Mobile uy tín số 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-500 bg-gray-50 dark:bg-[#0a0a0c] text-gray-900 dark:text-gray-100 flex flex-col min-h-screen" suppressHydrationWarning>
        <ThemeProvider>

          <div className="flex-grow">
            {children}
          </div>

          <Footer />

          {/* Dàn Component Nổi Toàn Màn Hình */}
          <ThemeToggle />
          <LiveSalesToast />
          <ContactWidget /> {/* <-- Kích hoạt Nút Liên Hệ */}

        </ThemeProvider>
      </body>
    </html>
  );
}