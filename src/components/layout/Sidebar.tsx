"use client";
import {useState, useEffect} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Swal from "sweetalert2";
import {useClerk} from "@clerk/nextjs";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  Briefcase,
  Building2,
  CreditCard,
  Bell,
  MessageCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export function Sidebar({onToggle}: {onToggle: (expanded: boolean) => void}) {
  // Inicialización de Clerk
  const {signOut} = useClerk();

  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onToggle(isExpanded);
  }, [isExpanded, onToggle]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    {name: "Dashboard", href: "/dashboard", icon: LayoutDashboard},
    {name: "Empleados", href: "/empleados", icon: Users},
    {
      name: "Registro de empleados",
      href: "/registroEmpleados",
      icon: UserPlus,
    },
    {name: "Categorías laborales", href: "/categorias", icon: Briefcase},
    {name: "Plan de suscripción", href: "/plan", icon: CreditCard},
    {name: "Notificaciones", href: "/notificaciones", icon: Bell},
    {name: "Mensajería", href: "/mensajeria", icon: MessageCircle},
  ];

  // Lógica de cerrar sesión modificada
  const handleCerrarSesion = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Se cerrará tu sesión actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0E6922",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente.",
          icon: "success",
          confirmButtonColor: "#0E6922",
        }).then(() => {
          // *** MODIFICACIÓN AQUÍ ***
          // Reemplazamos la redirección de Auth0 por la función signOut de Clerk
          signOut({redirectUrl: "/"}); // Redirige a la raíz después de cerrar sesión
        });
      }
    });
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-100 border-r border-gray-200 shadow-lg text-black transition-all duration-300 z-40
        ${isExpanded ? "w-70" : "w-20"}`}
    >
      <div className="flex flex-col h-full py-4 relative">
        <div className="flex flex-col border-b border-gray-300 mb-2">
          <Link href="/dashboard" className={`flex items-center gap-2 ${isExpanded ? "p-4" : "py-3 justify-center"}`}>
            <div className="w-10 h-10 bg-[#083E96] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-2xl">HR</span>
            </div>
            {isExpanded && (
              <span className="text-2xl font-semibold text-black transition-opacity duration-300 whitespace-nowrap">
                SYSTEM
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`absolute top-9 flex items-center justify-center w-8 h-8 rounded-full text-gray-700 hover:text-black hover:bg-gray-200 transition-colors flex-shrink-0  z-50
              ${isExpanded ? "right-[-1px]" : "right-[-10px]"}`}
          >
            {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
        <nav className={`flex-grow mt-2 ${isExpanded ? "px-4" : "px-0"}`}>
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              // const linkClasses = isActive
              // 	 ? "flex items-center p-3 rounded-lg bg-[#083E96] text-white font-semibold shadow-md justify-center lg:justify-start"
              // 	 : "flex items-center p-3 rounded-lg hover:bg-gray-300 hover:text-black transition-colors justify-center lg:justify-start";

              const baseLinkClasses = isActive
                ? "flex items-center p-3 rounded-lg bg-[#083E96] text-white font-semibold shadow-md"
                : "flex items-center p-3 rounded-lg hover:bg-gray-300 hover:text-black transition-colors";

              return (
                <li key={link.name} className="mb-2">
                  <Link href={link.href}>
                    <span
                      className={`${baseLinkClasses} ${isExpanded ? "w-full justify-start" : "w-full justify-center"}`}
                    >
                      <link.icon className="w-5 h-5 min-w-[20px]" />
                      {isExpanded && (
                        <span className="ml-3 transition-opacity duration-300 whitespace-nowrap">{link.name}</span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={`mt-auto pt-4 border-t border-gray-300 mb-10 ${isExpanded ? "px-4" : "px-0"}`}>
          <button
            onClick={handleCerrarSesion}
            className={`flex items-center w-full p-3 rounded-lg text-black hover:bg-[#0E6922] hover:text-white border border-gray-300 transition-colors cursor-pointer ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
          >
            <LogOut className="w-5 h-5 min-w-[20px]" />
            {isExpanded && <span className="ml-3 transition-opacity duration-300">cerrar sesión</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
