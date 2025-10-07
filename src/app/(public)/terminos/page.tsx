import Link from "next/link";

export default function TerminosPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones de Uso</h1>
      <p className="mb-4">Última actualización: [fecha]</p>

      <p className="mb-4">
        Al acceder y utilizar el sitio web de <strong>HRSYSTEM</strong>, aceptás
        cumplir con los siguientes términos y condiciones. Si no estás de
        acuerdo, por favor no utilices este sitio.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Uso permitido</h2>
      <p className="mb-4">
        El sitio podrá ser utilizado únicamente con fines legales y personales.
        Está prohibido:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Usar el sitio para actividades ilícitas o fraudulentas.</li>
        <li>
          Intentar dañar, interrumpir o acceder sin autorización al sistema.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Propiedad intelectual
      </h2>
      <p className="mb-4">
        Todos los contenidos del sitio (textos, imágenes, logotipos, diseños,
        software) son propiedad de HRSYSTEM o de sus licenciantes, y no podrán
        ser utilizados sin autorización expresa.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Registro y cuentas</h2>
      <p className="mb-4">
        Algunas secciones pueden requerir la creación de una cuenta. El usuario
        es responsable de la veracidad de la información proporcionada y de
        mantener la confidencialidad de sus credenciales.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Limitación de responsabilidad
      </h2>
      <p className="mb-4">
        HRSYSTEM no garantiza que el sitio esté libre de errores, virus o
        interrupciones. El uso del sitio es bajo tu propio riesgo.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Enlaces externos</h2>
      <p className="mb-4">
        Nuestro sitio puede incluir enlaces a sitios de terceros. No somos
        responsables de su contenido ni de sus políticas.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Modificaciones</h2>
      <p className="mb-4">
        Nos reservamos el derecho de modificar estos términos en cualquier
        momento. Los cambios entrarán en vigor a partir de su publicación en
        este sitio web.
      </p>

      <Link href="/" className="text-blue-600 underline">
        Volver al inicio
      </Link>
    </section>
  );
}
