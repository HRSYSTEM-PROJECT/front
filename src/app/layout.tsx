import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContextProvider";
import ToastProvider from "@/components/toastProvider";
import { Auth0ProviderWrapper } from "@/components/auth0/Auth0ProviderWrapper";

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
      <body className={`${poppins.variable} antialiased`}>
        <Auth0ProviderWrapper>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
}
