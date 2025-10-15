"use client";
import { deletePosition } from "@/services/PositionService";
import { Posicion } from "@/types/categorias";
import { useAuth } from "@clerk/nextjs";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

interface PositionListProps {
  positions: Posicion[];
  isLoading: boolean;
  error: string | null;
  onDeleteSuccess: () => void;
}

const PositionList: React.FC<PositionListProps> = ({
  positions,
  isLoading,
  error,
  onDeleteSuccess,
}) => {
  const { getToken } = useAuth();

  const handleDelete = async (id: string, nombre: string) => {
    if (!id) {
      Swal.fire("Error", "ID de posición no encontrado.", "error");
      return;
    }
    const result = await Swal.fire({
      title: `¿Eliminar ${nombre}?`,
      text: "Esta acción eliminará la posición laboral permanentemente.",
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
        await deletePosition(id, token!);

        Swal.fire(
          "¡Eliminado!",
          "La posición ha sido eliminada correctamente.",
          "success"
        );
        onDeleteSuccess();
      } catch (error) {
        console.error(error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Hubo un error al eliminar la posición.";
        Swal.fire("Error", errorMessage, "error");
      }
    }
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Cargando posiciones...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="p-6 text-gray-500">No hay posiciones registradas.</div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 border-b pb-2">
        Posiciones Laborales
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Lista completa de posiciones en la organización
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rango Salarial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleados
              </th> */}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {positions.map((position) => (
              <tr key={position.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {position.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">
                  <div className="h-16 overflow-hidden text-ellipsis">
                    {position.description}
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    5{" "}
                  </span>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      className="text-red-600 hover:text-red-900 transition"
                      onClick={() =>
                        handleDelete(position.id || "", position.name)
                      }
                    >
                      <Trash2 className="h-5 w-5 cursor-pointer" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionList;
