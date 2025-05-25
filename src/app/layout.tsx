import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/app/Providers";

export const metadata: Metadata = {
  title: "ShopWave - Your Ultimate Shopping Destination",
  description:
    "Discover a wide range of products at ShopWave. Quality, affordability, and style, all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className={`font-sans antialiased flex flex-col min-h-screen`}>
        <CartProvider>
          <Providers>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:px-6">
              {children}
            </main>
            <Footer />
          </Providers>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
