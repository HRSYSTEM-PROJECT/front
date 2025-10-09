"use client";

import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.AUTH0_DOMAIN || "";
const clientId = process.env.AUTH0_CLIENTID || "";



export function Auth0ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const redirectUri =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
