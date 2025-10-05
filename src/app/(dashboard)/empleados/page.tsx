import EmployeeTable from "@/components/empleados/employeetable";

export default function EmpleadoPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Empleados</h1>
      <p className="mb-4 text-gray-600">
        Gestiona y visualiza todos los empleados de la empresa
      </p>
      <EmployeeTable />
    </div>
  );
}