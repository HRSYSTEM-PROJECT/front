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

// 🔹 Obtener notificaciones
export const getNotifications = async (token: string | null) => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Datos del backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    throw error;
  }
};

// 🔹 Marcar todas como leídas
export const markAllAsRead = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);

    if (!res.ok) {
      throw new Error(`Error al marcar todas como leídas: ${res.status}`);
    }
  } catch (error) {
    console.error("Error en markAllAsRead:", error);
    throw error;
  }
};

// 🔹 Eliminar una notificación
export const deleteNotification = async (token: string, notificationId: string) => {
  try {
    const res = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`Error al eliminar notificación: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error en deleteNotification:", error);
    throw error;
  }
};

// 🔹 Agendar un recordatorio
export const scheduleReminder = async (
  token: string,
  title: string,
  message: string,
  scheduledDate: string,
  type = "custom_notification"
) => {
  try {
    const response = await fetch(`${API_URL}/notifications/schedule-reminder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        message,
        scheduledDate,
        type,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al agendar recordatorio");
    }

    return response.json();
  } catch (error) {
    console.error("Error en scheduleReminder:", error);
    throw error;
  }
};

// 🔹 Obtener notificaciones automáticas (cron jobs)
export const getCronNotifications = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    const cronNotifications = data.notifications.filter((n: Notification) =>
      ["holiday_reminder", "birthday_reminder", "subscription_expiring", "subscription_expired"].includes(n.type)
    );

    return cronNotifications;
  } catch (error) {
    console.error("Error en getCronNotifications:", error);
    throw error;
  }
};
