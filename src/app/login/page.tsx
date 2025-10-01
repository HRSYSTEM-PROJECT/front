"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login con:", { email, password });
    //     // Más adelante: fetch/axios al backend para autenticar
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="card w-full max-w-md">
        <h1 className="title">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="input-field"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="input-field"
            required
          />

          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-black">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="text-[var(--primary)] underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
