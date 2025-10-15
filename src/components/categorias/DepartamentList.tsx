"use client";
import { deleteDepartment } from "@/services/DepartamentService";
import { Departmento } from "@/types/categorias";
import { useAuth } from "@clerk/nextjs";
import { Trash2, Users } from "lucide-react";
import React from "react";
import Swal from "sweetalert2";

interface DepartmentCardProps {
  dept: Departmento;
  onDeleteSuccess: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  dept,
  onDeleteSuccess,
}) => {
  const { getToken } = useAuth();

  const handleDelete = async () => {
    if (!dept.id) {
      Swal.fire("Error", "ID de departamento no encontrado.", "error");
      return;
    }
    const result = await Swal.fire({
      title: `¿Eliminar ${dept.nombre}?`,
      text: "Esta acción no se puede deshacer y podría afectar a los empleados asociados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const token = await getToken();
        await deleteDepartment(dept.id, token!);

        Swal.fire(
          "¡Eliminado!",
          "El departamento ha sido eliminado correctamente.",
          "success"
        );
        onDeleteSuccess();
      } catch (error) {
        console.error(error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Hubo un error al eliminar el departamento.";
        Swal.fire("Error", errorMessage, "error");
      }
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{dept.nombre}</h3>
        <div className="flex space-x-2">
          <button
            className="text-gray-500 hover:text-red-600 transition"
            onClick={handleDelete}
          >
            <Trash2 className="h-5 w-5 cursor-pointer" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">
        {dept.descripcion}
      </p>

      <div className="flex items-center text-sm text-gray-500 border-t pt-3">
        <Users className="h-4 w-4 mr-2" />
        <span>Empleados:</span>
        <span className="ml-auto font-bold bg-gray-200 px-3 py-1 rounded-full text-xs">
          10
        </span>
      </div>
    </div>
  );
};

interface DepartmentListProps {
  departments: Departmento[];
  onDeleteSuccess: () => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  onDeleteSuccess,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((dept) => (
        <DepartmentCard
          key={dept.id}
          dept={dept}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
};

export default DepartmentList;
