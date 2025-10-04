import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      <p className="mb-4">Última actualización: [fecha]</p>

      <p className="mb-4">
        En <strong>HRSYSTEM</strong> valoramos y respetamos la privacidad de
        nuestros usuarios. Esta Política de Privacidad explica cómo recopilamos,
        usamos y protegemos tu información personal cuando utilizás nuestro
        sitio web.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Información que recopilamos
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>Datos de contacto (nombre, correo electrónico, teléfono).</li>
        <li>
          Información de navegación (cookies, dirección IP, dispositivo,
          navegador).
        </li>
        <li>
          Datos que compartís voluntariamente al registrarte o contactarnos.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Uso de la información
      </h2>
      <p className="mb-4">La información se utiliza para:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Brindar, mejorar y personalizar nuestros servicios.</li>
        <li>Responder consultas y brindar soporte.</li>
        <li>Fines administrativos, de seguridad y prevención de fraudes.</li>
        <li>Enviar comunicaciones sobre novedades o actualizaciones.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Compartir información
      </h2>
      <p className="mb-4">
        No vendemos ni alquilamos tus datos personales. Solo podemos
        compartirlos con proveedores de servicios necesarios para la operación
        del sitio o autoridades legales cuando sea requerido.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Cookies y tecnologías similares
      </h2>
      <p className="mb-4">
        Usamos cookies para mejorar la experiencia del usuario, analizar
        estadísticas y optimizar nuestro sitio. Podés desactivar las cookies
        desde tu navegador.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Seguridad</h2>
      <p className="mb-4">
        Implementamos medidas razonables para proteger tu información. Sin
        embargo, ningún sistema es 100% seguro.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Derechos del usuario
      </h2>
      <p className="mb-4">
        Podés solicitar acceso, corrección o eliminación de tus datos personales
        enviando un correo a{" "}
        <a
          href="mailto:hrsystemproyecto@gmail.com"
          className="text-blue-600 underline"
        >
          hrsystemproyecto@gmail.com
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Cambios en esta política
      </h2>
      <p>
        Podemos actualizar esta Política de Privacidad en cualquier momento. Los
        cambios se publicarán en esta página.
      </p>

       <Link href="/" className="text-blue-600 underline">
        Volver al inicio
      </Link>
    </section>
  );
}
