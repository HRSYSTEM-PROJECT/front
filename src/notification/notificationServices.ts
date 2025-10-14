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
console.log("hola");

export const getNotifications = async (token: string | null) => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Datos del backend:", response.data);

    // Devolver solo el array de notificaciones
    return response.data.notifications || [];
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [];
  }
};

export const deleteNotification = async (token: string, notificationId: string) => {
  const res = await fetch(`${API_URL}/notifications/${notificationId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const scheduleReminder = async (
  token: string,
  title: string,
  message: string,
  scheduledDate: string,
  type = "custom_notification"
) => {
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
};

export const getCronNotifications = async (token: string) => {
  const response = await fetch(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  const cronNotifications = data.notifications.filter((n: Notification) =>
    ["holiday_reminder", "birthday_reminder", "subscription_expiring", "subscription_expired"].includes(n.type)
  );

  return cronNotifications;
};
