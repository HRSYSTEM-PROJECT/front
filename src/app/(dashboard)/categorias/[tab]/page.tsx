"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import DepartmentList from "@/components/categorias/DepartamentList";
import { Departmento, Posicion, TabType } from "@/types/categorias";
import PositionList from "@/components/categorias/PositionList";
import NewDepartmentForm from "@/components/categorias/NewDepartament";
import NewPositionForm from "@/components/categorias/NewPosition";
import { Plus, Building2, Briefcase } from "lucide-react";
import { getDepartments } from "@/services/DepartamentService";
import { useAuth } from "@clerk/nextjs";
import { getPosition } from "@/services/PositionService";

export default function CategoriasPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const tab = segments[segments.length - 1];
  const currentTab: TabType =
    tab === "posiciones" || tab === "departamentos"
      ? (tab as TabType)
      : "departamentos";

  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [departments, setDepartments] = useState<Departmento[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [errorDepartments, setErrorDepartments] = useState<string | null>(null);
  const [positions, setPositions] = useState<Posicion[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(true);
  const [errorPositions, setErrorPositions] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setIsLoadingDepartments(true);
    setErrorDepartments(null);
    try {
      const token = await getToken();
      const data = await getDepartments(token!);
      setDepartments(data);
    } catch (err) {
      setErrorDepartments("No se pudieron cargar los departamentos.");
    } finally {
      setIsLoadingDepartments(false);
    }
  }, [getToken]);

  const fetchPositions = useCallback(async () => {
    if (currentTab !== "posiciones") return;
    setIsLoadingPositions(true);
    setErrorPositions(null);
    try {
      const token = await getToken();
      const data = await getPosition(token!);
      setPositions(data);
    } catch (err) {
      setErrorPositions("No se pudieron cargar las posiciones.");
    } finally {
      setIsLoadingPositions(false);
    }
  }, [currentTab, getToken]);

  const handlePositionCreationSuccess = () => {
    setIsCreatingNew(false);
    fetchPositions();
  };
  const handleDepartmentCreationSuccess = () => {
    setIsCreatingNew(false);
    fetchDepartments();
  };

  useEffect(() => {
    if (currentTab === "departamentos") {
      fetchDepartments();
    } else if (currentTab === "posiciones") {
      fetchPositions();
    }
  }, [currentTab, fetchDepartments, fetchPositions]);

  const handleTabChange = (newTab: TabType) => {
    setIsCreatingNew(false);
    router.push(`/categorias/${newTab}`);
  };

  return (
    <div className="mt-10 ml-10 mb-10">
      <div className="max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          Categorias Laborales
        </h1>
        <p className="text-gray-500 mb-6">
          Gestiona los departamentos y posiciones de la empresa.
        </p>
        <div className="flex space-x-2 border-b border-gray-200 mb-8">
          <button
            onClick={() => handleTabChange("departamentos")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition cursor-pointer ${
              currentTab === "departamentos"
                ? "bg-white border-x border-t border-gray-200 text-[#083E96]"
                : "text-gray-500 hover:text-[#083E96]"
            }`}
          >
            <Building2 className="h-5 w-5 mr-2" />
            Departamentos
          </button>
          <button
            onClick={() => handleTabChange("posiciones")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition cursor-pointer ${
              currentTab === "posiciones"
                ? "bg-white border-x border-t border-gray-200 text-[#083E96]"
                : "text-gray-500 hover:text-[#083E96]"
            }`}
          >
            <Briefcase className="h-5 w-5 mr-2" />
            Posiciones
          </button>
        </div>
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setIsCreatingNew(true);
            }}
            className="flex items-center space-x-1 bg-[#083E96] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#0a4ebb] transition cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            <span>
              {currentTab === "departamentos"
                ? "Nuevo Departamento"
                : "Nueva Posición"}
            </span>
          </button>
        </div>
        {isCreatingNew && (
          <div className="mb-8">
            {currentTab === "departamentos" && isCreatingNew && (
              <NewDepartmentForm
                onCancel={() => setIsCreatingNew(false)}
                onSuccess={handleDepartmentCreationSuccess}
              />
            )}
            {currentTab === "posiciones" && isCreatingNew && (
              <NewPositionForm
                onCancel={() => setIsCreatingNew(false)}
                onSuccess={handlePositionCreationSuccess}
              />
            )}
          </div>
        )}
        <div className="pt-4">
          {currentTab === "departamentos" && !isCreatingNew && (
            <>
              {isLoadingDepartments && <p>Cargando departamentos...</p>}
              {errorDepartments && (
                <p className="text-red-500">{errorDepartments}</p>
              )}
              {!isLoadingDepartments && !errorDepartments && (
                <DepartmentList
                  departments={departments}
                  onDeleteSuccess={fetchDepartments}
                />
              )}
            </>
          )}
          {currentTab === "posiciones" && !isCreatingNew && (
            <PositionList
              positions={positions}
              isLoading={isLoadingPositions}
              error={errorPositions}
              onDeleteSuccess={fetchPositions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
