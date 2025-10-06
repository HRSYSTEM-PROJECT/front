"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContextProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function Sidebar({
  onToggle,
}: {
  onToggle: (expanded: boolean) => void;
}) {
  const { logout } = useAuth();
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
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Empleados", href: "/empleados", icon: Users },
    {
      name: "Registro de empleados",
      href: "/registroEmpleados",
      icon: UserPlus,
    },
    { name: "Categorías laborales", href: "/categorias", icon: Briefcase },
    { name: "Perfil de empresa", href: "/perfil", icon: Building2 },
    { name: "Plan de suscripción", href: "/plan", icon: CreditCard },
    { name: "Notificaciones", href: "/notificaciones", icon: Bell },
    { name: "Mensajería", href: "/mensajeria", icon: MessageCircle },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-100 border-r border-gray-200 shadow-lg text-black transition-all duration-300 z-40
        ${isExpanded ? "w-70" : "w-20"}`}
    >
      <div className="flex flex-col h-full p-4 ">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#083E96] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">HR</span>
            </div>
            {isExpanded && (
              <span className="text-2xl font-semibold text-black transition-opacity duration-300">
                SYSTEM
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-gray-700 hover:text-black transition-colors"
          >
            {isExpanded ? (
              <ChevronLeft className="w-6 h-6" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </button>
        </div>

        <nav className="flex-grow mt-2">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const linkClasses = isActive
                ? "flex items-center p-3 rounded-lg bg-[#083E96] text-white font-semibold shadow-md"
                : "flex items-center p-3 rounded-lg hover:bg-gray-300 hover:text-black transition-colors";

              return (
                <li key={link.name} className="mb-2">
                  <Link href={link.href}>
                    <span className={linkClasses}>
                      <link.icon className="w-5 h-5 min-w-[20px]" />
                      {isExpanded && (
                        <span className="ml-3 transition-opacity duration-300 whitespace-nowrap">
                          {link.name}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-300 mb-10 p-1">
          <div>
            <h4 className="text-sm font-semibold mb-5 justify-center text-center">
              Admin User
            </h4>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full p-3 rounded-lg text-black hover:bg-[#0E6922] hover:text-white border border-gray-300 transition-colors"
          >
            <LogOut className="w-5 h-5 min-w-[20px]" />
            {isExpanded && (
              <span className="ml-3 transition-opacity duration-300">
                Cerrar Sesión
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
