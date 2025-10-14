import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL; // tu backend base URL

export const getNotifications = async (token: string | null) => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📬 Datos del backend:", response.data);

    // ✅ devolver solo el array de notificaciones
    return response.data.notifications || [];
  } catch (error) {
    console.error("❌ Error al obtener notificaciones:", error);
    return [];
  }
};

export const markAsRead = async (id: number) => {
  await axios.post(`${API_URL}/notifications/mark-read/${id}`);
};

export const markAllAsRead = async () => {
  await axios.post(`${API_URL}/notifications/mark-all-read`);
};

export const deleteNotification = async (id: number) => {
  await axios.delete(`${API_URL}/notifications/${id}`);
};

export const deleteAllNotifications = async () => {
  await axios.delete(`${API_URL}/notifications/delete-all`);
};
