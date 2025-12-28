// app/layout.tsx
"use client";

<<<<<<< HEAD
=======
import type { Metadata } from "next";

>>>>>>> main
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Provider from "@/components/provider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
<<<<<<< HEAD
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
=======
import { Toaster } from "@/components/ui/sonner";




>>>>>>> main

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide footer on dashboard routes
  const hideFooter = pathname.startsWith("/dashboard");

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
<<<<<<< HEAD
      <body className={`${inter.variable} ${playfair.variable} antialiased leading-8 overflow-x-hidden`}>
=======
      <body
        className={`${inter.variable} ${playfair.variable} antialiased leading-8 overflow-x-hidden`}>
>>>>>>> main
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <Navbar />
            {children}
<<<<<<< HEAD
            <Toaster position="top-right" richColors />
            {!hideFooter && <Footer />}
=======
            <Toaster position="top-center" richColors/>
            <Footer />
>>>>>>> main
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
