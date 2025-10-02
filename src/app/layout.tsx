import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "HR SYSTEM",
  description: "Sistema de gestión de recursos humanos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body
        className={`flex flex-col min-h-screen ${poppins.variable} antialiased`}
      >
        <Navbar />
        <main className="flex-1 pt-25">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
