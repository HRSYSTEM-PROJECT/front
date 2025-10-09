"use client";

import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "";
const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENTID || "";

export function Auth0ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const redirectUri =
    typeof window !== "undefined" ? window.location.origin : "";

  const authorizationParams = {
    response_type: "code",
    scope: "openid profile email",
    redirect_uri: redirectUri,
  };

  if (!domain || !clientId) {
    return <div>Error de Configuración de Auth0: Faltan credenciales.</div>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={authorizationParams}
    >
      {children}
    </Auth0Provider>
  );
}
