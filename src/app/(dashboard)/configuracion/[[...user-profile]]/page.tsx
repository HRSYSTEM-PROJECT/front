import { UserProfile } from "@clerk/nextjs";

export default function ConfiguracionPage() {
  return (
    <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 w-full">
      <h2 className="text-2xl font-bold text-gray-800">
        Configuración de la cuenta
      </h2>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Gestiona tu perfil y configuraciones de seguridad, incluyendo el cambio
        de contraseña.
      </p>
      <div className="flex justify-center md:block w-full">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full shadow-none",
              card: "w-full shadow-none",
            },
          }}
        />
      </div>
    </div>
  );
}
