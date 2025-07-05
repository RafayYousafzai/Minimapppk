
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext"; // Added
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/app/Providers"; // HeroUIProvider

export const metadata: Metadata = {
  title: "Minimapppk - Your Ultimate Shopping Destination",
  description:
    "Discover a wide range of products at Minimapppk. Quality, affordability, and style, all in one place.",
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
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`} // Added 'dark' class here
    >
      <body className={`font-sans antialiased flex flex-col min-h-screen `}>
        <AuthProvider> {/* Added AuthProvider wrapping CartProvider and others */}
          <CartProvider>
            <Providers> {/* This wraps HeroUIProvider */}
              <Header />
              <main className="flex-grow mx-auto py-8 overflow-x-hidden">{children}</main>
              <Footer />
            </Providers>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
