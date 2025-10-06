"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContextProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push("/login");
  //   }
  // }, [isAuthenticated, isLoading, router]);
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       Cargando sesión...
  //     </div>
  //   );
  // }
  // if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen transition-all duration-300">
      <Sidebar onToggle={setIsSidebarExpanded} />
      <main
        className={`flex-1 transition-all duration-300 px-6 pt-6 bg-gray-100 ${
          isSidebarExpanded ? "ml-70" : "ml-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
