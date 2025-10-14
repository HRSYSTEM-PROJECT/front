import { Departmento } from "@/types/categorias";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export interface DepartmentoPayload {
  id?: string;
  nombre: string;
  descripcion: string;
}

export async function getDepartments(token: string): Promise<Departmento[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/departamento`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: Fallo al obtener departamentos`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
}

export async function createDepartment(
  data: DepartmentoPayload,
  token: string
): Promise<Departmento> {
  try {
    const response = await fetch(`${API_BASE_URL}/departamento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Error ${response.status}: Fallo al crear el departamento`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
}

export async function deleteDepartment(
  id: string,
  token: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/departamento/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 204) {
      return;
    }

    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: Fallo al eliminar el departamento`
      );
    }
  } catch (error) {
    console.error(`Error deleting department ${id}:`, error);
    throw error;
  }
}
