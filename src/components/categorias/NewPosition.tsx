import React, { useState } from "react";

interface NewPositionFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const MOCK_DEPARTMENTS_OPTIONS = [
  { id: "TI", name: "Tecnología de la Información (TI)" },
  { id: "FIN", name: "Finanzas y Contabilidad" },
  { id: "RRHH", name: "Recursos Humanos (RR.HH.)" },
];

const NewPositionForm: React.FC<NewPositionFormProps> = ({
  onCancel,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [minSalary, setMinSalary] = useState("30000");
  const [maxSalary, setMaxSalary] = useState("50000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar el formulario (p. ej., llamada a la API)
    console.log("Creando Posición:", {
      name,
      departmentId,
      minSalary,
      maxSalary,
    });

    // Simular éxito y limpiar
    // onSuccess();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 border border-blue-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Crear Nueva Posición
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Complete los datos de la nueva posición laboral
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700 text-sm font-medium">
            Nombre de la Posición *
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ej: Desarrollador de Software"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 text-sm font-medium">
            Departamento *
          </span>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Seleccione un departamento
            </option>
            {MOCK_DEPARTMENTS_OPTIONS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </label>

        {/* Salarios */}
        <div className="flex space-x-4">
          <label className="block flex-1">
            <span className="text-gray-700 text-sm font-medium">
              Salario Mínimo
            </span>
            <input
              type="number"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
          <label className="block flex-1">
            <span className="text-gray-700 text-sm font-medium">
              Salario Máximo
            </span>
            <input
              type="number"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Crear Posición
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPositionForm;
