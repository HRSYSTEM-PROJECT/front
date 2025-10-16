"use client";
import { toast } from "react-toastify";
import {
  Users,
  Building2,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const router = useRouter();

  const employees = [
    {
      id: 1,
      name: "Lucía",
      last_name: "Fernández",
      email: "lucia.fernandez@example.com",
      dni: "12345678",
      cuil: "20-12345678-9",
      position: "Desarrolladora Frontend",
      department: "IT",
    },
    {
      id: 2,
      name: "Martín",
      last_name: "Gómez",
      email: "martin.gomez@example.com",
      dni: "87654321",
      cuil: "20-87654321-0",
      position: "Diseñador UI/UX",
      department: "Diseño",
    },
    {
      id: 3,
      name: "Carla",
      last_name: "López",
      email: "carla.lopez@example.com",
      dni: "13579246",
      cuil: "20-13579246-1",
      position: "Contadora",
      department: "Administración",
    },
  ];

  const admins = [
    {
      id: 1,
      name: "Lucía",
      lastName: "Fernández",
      email: "lucia.fernandez@example.com",
      role: "Super Admin",
    },
    {
      id: 2,
      name: "Martín",
      lastName: "Gómez",
      email: "martin.gomez@example.com",
      role: "Admin",
    },
    {
      id: 3,
      name: "Carla",
      lastName: "López",
      email: "carla.lopez@example.com",
      role: "Admin",
    },
  ];

  const cards = [
    {
      icon: Bell,
      titulo: "Notificaciones Inteligentes",
      descripcion:
        "Recibe alertas automáticas sobre eventos importantes y fechas clave.",
      color: "#863f19",
      bgColor: "#FAB894",
    },
    {
      icon: MessageSquare,
      titulo: "Comunicación interna",
      descripcion:
        "Facilita la colaboración con herramientas de mensajería y anuncios corporativos.",
      color: "#83232f",
      bgColor: "#FA8998",
    },
  ];

  const Busqueda = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const handleFakeAction = () => {
    toast.info(
      "✨ Esta es una función de demostración. Los cambios no se guardan."
    );
  };

  const Avatar = ({ name }: { name: string }) => {
    const names = name.split(" ");
    const initials = names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
    const colors = "bg-[#083E96] text-white";

    return (
      <div
        className={`flex items-center justify-center h-10 w-10 rounded-full ${colors} flex-shrink-0`}
      >
        <span className="text-sm font-medium">{initials}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 flex flex-col justify-center min-h-screen">
      <header className="bg-[#083E96] text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-white text-[#083E96] px-4 py-2 rounded-md hover:bg-gray-200 transition flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </button>
      </header>

      <div className="bg-yellow-100 text-yellow-800 text-center py-2 font-semibold">
        Estás en la versión demo. Los datos son ficticios y no se guardan.
      </div>

      <main className="p-6 sm:p-8 mx-auto space-y-10 max-w-6xl w-full flex flex-col items-center">
        <section className="gap-6 mx-auto">
          <div className="bg-white p-5 sm:p-8 items-center rounded-xl shadow-md border border-gray-100 mt-8 w-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <Building2 className="w-14 h-14 text-blue-600 bg-blue-100 p-4 rounded-md flex-shrink-0" />
              <div>
                <h4 className="text-lg font-medium text-gray-800 break-words">
                  Empresa Ficticia S.A.
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-6 sm:gap-x-12 mt-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-gray-500 text-sm">Email</h4>
                  <p className="text-gray-800 text-sm sm:text-base break-words">
                    empresaficticia@example.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-gray-500 text-sm">Teléfono</h4>
                  <p className="text-gray-800 text-sm sm:text-base">
                    +54 11 1234-5678
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-gray-500 text-sm">Dirección</h4>
                  <p className="text-gray-800 text-sm sm:text-base break-words">
                    Av. Ficticia 1234, Ciudad, País
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-gray-500 text-sm">Empleados</h4>
                  <p className="text-gray-800 text-sm sm:text-base">100</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-gray-900 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-gray-500 text-sm">Fecha de creación</h4>
                  <p className="text-gray-800 text-sm sm:text-base">
                    1 de enero de 2020
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-500 mb-6 text-sm sm:text-base mt-10 text-center italic">
              En el <span className="font-bold">dashboard</span>, podrás ver y
              editar la información de la empresa, ver cantidad de empleados,
              sus ausecias totales y administradores de la plataforma.
            </p>
          </div>
        </section>
      </main>

      <div className="flex flex-col lg:flex-row justify-center gap-10 w-full max-w-8xl mx-auto px-4">
        <div>
          <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md border border-gray-100 mt-8 w-full">
            <h2 className="text-lg font-medium text-gray-800">
              Administradores
            </h2>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              Gestiona los usuarios con acceso administrativo
            </p>
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 rounded-lg p-4 mb-3 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <Avatar name={`${admin.name} ${admin.lastName}`} />
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {admin.name} {admin.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                </div>
                <span className="mt-2 sm:mt-0 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md self-start sm:self-auto">
                  {admin.role}
                </span>
              </div>
            ))}
            <p className="text-gray-500 mb-6 text-sm sm:text-base mt-10 text-center italic">
              Aquí podrías agregar, editar o eliminar administradores reales.
            </p>
          </div>
        </div>
        <div>
          <section className="bg-white rounded-xl shadow-md p-6">
            <div className="container mx-auto p-4 sm:p-6 text-start">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mt-4 sm:mt-8 text-black">
                    Empleados
                  </h1>
                  <p className="text-gray-600 mt-3 sm:mt-5">
                    Podrás gestionar y visualizar todos los empleados de la
                    empresa
                  </p>
                </div>
                <button className="flex items-center text-sm text-white font-medium rounded bg-[#083E96] hover:bg-[#0a4ebb] p-3 cursor-pointer transition"
                  onClick={handleFakeAction}>
                  <UserPlus className="inline-block mr-1" />
                  <span className="hidden sm:inline">Nuevo empleado</span>
                </button>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-10 mb-10">
                <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                  <div className="relative flex items-center w-full md:w-auto flex-grow h-11">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Busqueda />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar por APELLIDO o DNI..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-sm h-full"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h4 className="text-lg font-semibold mb-6">
                  Lista de Empleados ({employees.length})
                </h4>
                <div className="border border-gray-300" />

                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 border-b border-gray-200"
                  >
                    <div className=" hover:bg-gray-50 rounded transition">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          name={`${employee.name} ${employee.last_name}`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {employee.name} {employee.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {employee.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 font-medium text-gray-700 text-sm">
                        <div>
                          <span className="font-bold">DNI: </span>
                          {employee.dni}
                        </div>
                        <div>
                          <span className="font-bold">CUIL: </span>
                          {employee.cuil}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <button className="block text-center text-sm text-white font-medium rounded bg-[#083E96] hover:bg-[#0a4ebb] px-4 py-2 transition cursor-pointer"
                        onClick={handleFakeAction}>
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 mb-6 text-sm sm:text-base mt-10 text-center italic">
                En los{" "}
                <span className="font-bold">detalles de cada empleado</span>,
                podrás ver y editar su información personal, marcar sus
                ausencias y la posibilidad de cambiar el rol de empleados a
                Administrador.
              </p>
            </div>
          </section>
        </div>
      </div>
      <div className="bg-[#083E96] text-white text-center py-6 mt-20 h-100">
        <h3 className="text-2xl md:text-5xl font-bold text-white leading-tight mt-10">
          ¿Listo para transformar tu gestión de RRHH?
        </h3>
        <p className="text-white text-lg md:text-xl mb-20 mx-auto max-w-5xl mt-15">
          Únete a cientos de empresas que ya confían en HR SYSTEM para gestionar
          su talento humano
        </p>
        <button
          onClick={() => (window.location.href = "/register")}
          className="bg-white text-black font-semibold px-6 py-3 rounded-md shadow-md hover:bg-[#0E6922] hover:text-white transition-colors cursor-pointer"
        >
          Empieza gratis
        </button>
      </div>
    </div>
  );
}
