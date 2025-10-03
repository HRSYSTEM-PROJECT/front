// Usamos 'use client' solo si hay interacción o hooks (useState/useEffect)
// Pero si solo estamos haciendo fetch en el servidor, no es necesario.
// En este caso, haremos todo en el servidor (por defecto en el App Router)

// Definiciones de Tipos
interface CompanyData {
  trade_name: string;
  legal_name: string;
  address: string;
  phone_number: string;
  email: string;
}

// Función principal del componente (¡ahora es asíncrona!)
export default async function PruebaPage() {
  // En el App Router, las variables de entorno PÚBLICAS se acceden directamente:
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  let status = "";
  let companyData: CompanyData | null = null;

  if (!API_BASE_URL) {
    status = "ERROR: NEXT_PUBLIC_API_URL no está configurada.";
  } else {
    try {
      // 1. Definimos el endpoint completo (Asumimos '/company-info')
      const endpoint = `${API_BASE_URL}/company-info`;
      console.log("Intentando conectar a:", endpoint);

      // 2. Hacemos la petición (fetch en el servidor de Vercel)
      const response = await fetch(endpoint, { cache: "no-store" }); // Desactivamos cache para forzar la prueba

      if (response.ok) {
        companyData = await response.json();
        status = "CONEXIÓN EXITOSA";
      } else {
        status = `ERROR HTTP: ${response.status} - Respuesta del Back-End.`;
      }
    } catch (error) {
      // 3. Capturamos errores de red, DNS o servidor caído
      console.error("Fallo grave al conectar la API:", error);
      status = "FALLÓ LA CONEXIÓN (Revisar Render o CORS).";
    }
  }

  // Renderizado del componente
  return (
    <div className="p-8 max-w-xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">
        Prueba de Conexión Next.js ↔️ Render
      </h1>

      <p className="font-semibold text-lg">Estado:</p>
      <div
        className={`p-3 rounded-lg text-white font-mono text-sm ${
          companyData
            ? "bg-green-600"
            : status.includes("EXITOSA") || status.includes("HTTP")
            ? "bg-yellow-600"
            : "bg-red-600"
        }`}
      >
        {status}
      </div>

      <h2 className="text-2xl mt-8 mb-4">Resultado del Back-End:</h2>

      {companyData ? (
        <div className="border border-green-400 p-4 rounded-lg bg-green-50 shadow-md">
          <p className="text-green-800 font-medium mb-2">
            🎉 Datos de la Empresa Recibidos Correctamente.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>**Nombre Comercial:** {companyData.trade_name}</li>
            <li>**Razón Social:** {companyData.legal_name}</li>
            <li>**Email:** {companyData.email}</li>
            <li>**Dirección:** {companyData.address}</li>
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 italic">
          No se pudieron cargar los datos o la conexión falló.
        </p>
      )}

      <p className="mt-8 text-sm text-gray-500">
        Esta prueba se ejecutó en el servidor de Vercel.
      </p>
    </div>
  );
}
