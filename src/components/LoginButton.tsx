"use client";

import { useAuth0 } from "@auth0/auth0-react";

export function LoginButton() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Cargando autenticación...</div>;
  }

  if (isAuthenticated) {
    return (
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Cerrar Sesión
      </button>
    );
  } else {
    return (
      <button
        onClick={() =>
          loginWithRedirect({
            appState: {
              returnTo: "/dashboard",
            },
            authorizationParams: {
              redirect_uri: window.location.origin,
            },
          })
        }
        className="px-4 py-2 hover:bg-[#0E6922] text-black hover:text-white rounded cursor-pointer transition-colors duration-300"
      >
        Iniciar Sesión
      </button>
    );
  }
}
