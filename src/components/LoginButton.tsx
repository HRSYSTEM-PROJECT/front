import {SignInButton, SignedIn, SignedOut} from "@clerk/nextjs";
import {UserButton} from "@clerk/nextjs"; // Componente para cerrar sesión y perfil

export function ClerkLoginButton() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 hover:bg-[#0E6922] text-black hover:text-white rounded cursor-pointer transition-colors duration-300">
            Iniciar Sesión
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );
}
