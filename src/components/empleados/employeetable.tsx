"use client";
import { useState } from "react";

interface Employee {
  id: number;
  nombre: string;
  puesto: string;
  estado: string;
}

export default function EmployeeTable() {
  const [empleados, setEmpleados] = useState<Employee[]>([
    { id: 1, nombre: "Mario González", puesto: "Dev Senior", estado: "Activo" },
    { id: 2, nombre: "Laura Pérez", puesto: "Diseñadora UX", estado: "Inactivo" },
  ]);

  const agregarEmpleado = () => {
    const nuevoEmpleado: Employee = {
      id: Date.now(),
      nombre: "Nuevo Empleado",
      puesto: "Sin asignar",
      estado: "Activo",
    };
    setEmpleados([...empleados, nuevoEmpleado]);
  };

  const eliminarEmpleado = (id: number) => {
    setEmpleados(empleados.filter((e) => e.id !== id));
  };

  const editarEmpleado = (id: number) => {
    setEmpleados(
      empleados.map((e) =>
        e.id === id ? { ...e, nombre: e.nombre + " (editado)" } : e
      )
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Nombre</th>
            <th className="p-2">Puesto</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp) => (
            <tr key={emp.id} className="border-b">
              <td className="p-2">{emp.nombre}</td>
              <td className="p-2">{emp.puesto}</td>
              <td className="p-2">{emp.estado}</td>
              <td className="p-2 space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => editarEmpleado(emp.id)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => eliminarEmpleado(emp.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={agregarEmpleado}
      >
        + Nuevo empleado
      </button>
    </div>
  );
}