import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "Frilogix | Intelligent Software & AI Engineering",
  description: "Frilogix builds intelligent, scalable web, mobile, and AI-powered applications using modern technologies such as React, Node.js, Go, React Native, and LLM-based systems.",
  keywords: ["Software development company", "AI engineering", "React development", "Backend development", "Mobile app development"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans overflow-x-hidden min-h-screen`} suppressHydrationWarning>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
