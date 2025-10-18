import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  time: string | { $date: string };
  read: boolean;
}

//  Obtener notificaciones
export const getNotifications = async (token: string | null) => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Datos del backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener notificaciones:", error);
    throw error;
  }
};

//  Marcar una notificación como leída
export const markAsRead = async (token: string, notificationId: string) => {
  try {
    const res = await fetch(`${API_URL}/notifications/mark-read/${notificationId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Error al marcar notificación como leída: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("❌ Error en markAsRead:", error);
    throw error;
  }
};

//  Marcar todas como leídas
export const markAllAsRead = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Error al marcar todas como leídas: ${res.status}`);
    return res.text();
  } catch (error) {
    console.error("❌ Error en markAllAsRead:", error);
    throw error;
  }
};

//  Eliminar una notificación
export const deleteNotification = async (token: string, notificationId: string) => {
  try {
    const res = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Error al eliminar notificación: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("❌ Error en deleteNotification:", error);
    throw error;
  }
};

//  Agendar un recordatorio
export const scheduleReminder = async (
  token: string,
  title: string,
  message: string,
  scheduledDate: string,
  type = "custom_notification"
) => {
  try {
    const res = await fetch(`${API_URL}/notifications/schedule-reminder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, message, scheduledDate, type }),
    });

    if (!res.ok) throw new Error("Error al agendar recordatorio");
    return res.json();
  } catch (error) {
    console.error("❌ Error en scheduleReminder:", error);
    throw error;
  }
};

//  Obtener notificaciones automáticas (cron jobs)
export const getCronNotifications = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/notifications/cron-notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error al obtener notificaciones automáticas");

    const data = await res.json();
    return data.notifications || data;
  } catch (error) {
    console.error("❌ Error en getCronNotifications:", error);
    throw error;
  }
};

//  Obtener recordatorios programados
export const getScheduledReminders = async (token: string, page = 1, limit = 10) => {
  try {
    const res = await fetch(`${API_URL}/notifications/scheduled?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error al obtener recordatorios programados");

    const data = await res.json();
    return data.scheduledReminders || data;
  } catch (error) {
    console.error("❌ Error en getScheduledReminders:", error);
    throw error;
  }
};

//  Actualizar recordatorio programado
export const updateScheduledReminder = async (
  token: string,
  id: string,
  updatedData: { title?: string; message?: string; scheduledDate?: string; recipientType?: string }
) => {
  try {
    const res = await fetch(`${API_URL}/notifications/scheduled/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Error al actualizar recordatorio");
    return res.json();
  } catch (error) {
    console.error("❌ Error en updateScheduledReminder:", error);
    throw error;
  }
};

//  Eliminar recordatorio programado
export const deleteScheduledReminder = async (token: string, id: string) => {
  try {
    const res = await fetch(`${API_URL}/notifications/scheduled/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error al eliminar recordatorio");
    return res.json();
  } catch (error) {
    console.error("❌ Error en deleteScheduledReminder:", error);
    throw error;
  }
};
