"use client";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const isLoggedIn = true;

  const buttonClass =
    "px-4 py-2 rounded-md text-white font-medium bg-[#083E96] hover:bg-[#0a4ebb] transition-colors shadow-md whitespace-nowrap";
  const loginButtonClass =
    "font-medium text-black hover:bg-[#0E6922] hover:text-white px-4 py-2 rounded-md transition-colors duration-300 whitespace-nowrap";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
          >
            <div className="w-10 h-10 bg-[#083E96] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">HR</span>
            </div>
            <span className="text-2xl font-semibold text-black">SYSTEM</span>
          </Link>
          <div className="flex items-center gap-4">

            <SignedOut>
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="font-medium text-black hover:bg-[#0E6922] hover:text-white px-4 py-2 rounded-md transition-colors duration-300 whitespace-nowrap">
                  Iniciar Sesión
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            
            <Link href="/register" className={buttonClass}>
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
