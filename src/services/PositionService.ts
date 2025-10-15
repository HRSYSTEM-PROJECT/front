export interface Posicion {
  id?: string;
  name: string;
  description: string;
}

export interface PosicionPayload {
  name: string;
  description: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function getPosition(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/position`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: Fallo al obtener posiciones.`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
}

export async function createPosition(
  token: string,
  data: PosicionPayload
): Promise<Posicion> {
  try {
    const response = await fetch(`${API_BASE_URL}/position`, {
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
          `Error ${response.status}: Fallo al crear la posición.`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error creating position:", error);
    throw error;
  }
}

export async function updatePosition(
  id: string,
  token: string,
  data: Partial<PosicionPayload>
): Promise<Posicion> {
  try {
    const response = await fetch(`${API_BASE_URL}/position/${id}`, {
      method: "PATCH",
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
          `Error ${response.status}: Fallo al actualizar la posición.`
      );
    }

    return response.json();
  } catch (error) {
    console.error(`Error updating position ${id}:`, error);
    throw error;
  }
}

export async function deletePosition(id: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/position/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) return;

    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: Fallo al eliminar la posición.`
      );
    }
  } catch (error) {
    console.error(`Error deleting position ${id}:`, error);
    throw error;
  }
}
