"use client";
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
  LogOut,
  Menu,
  X,
} from "lucide-react";

export function Sidebar() {
  const { logout, company } = useAuth();
  const pathname = usePathname();

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
    { name: "Mensajería", href: "/mensajeria", icon: Menu },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-70 text-black bg-gray-100 border-b border-gray-200  p-4 shadow-xl z-40">
      <div className="flex flex-col h-full">
        <div className="border-b-1 border-gray-700 flex items-center justify-center">
          <a
            href="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 mt-8 mb-6 "
          >
            <div className="w-10 h-10 bg-[#083E96] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">HR</span>
            </div>
            <span className="text-2xl font-semibold text-black">SYSTEM</span>
          </a>
        </div>

        <nav className="flex-grow mt-4">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const linkClasses = isActive
                ? "flex items-center p-3 rounded-lg bg-[#083E96] text-white transition-colors cursor-pointer font-semibold shadow-md cursor-pointer"
                : "flex items-center p-3 rounded-lg hover:bg-gray-300 hover:text-black transition-colors cursor-pointer";

              return (
                <li key={link.name} className="mb-2">
                  <Link href={link.href} passHref>
                    <span className={linkClasses}>
                      <link.icon className="w-5 h-5 mr-3" />
                      {link.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full text-left p-3 rounded-lg text-black hover:bg-[#0E6922] hover:text-white border border-gray-300 cursor-pointer transition-colors"
          >
            <LogOut className="w-5 h-5 inline-block mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
