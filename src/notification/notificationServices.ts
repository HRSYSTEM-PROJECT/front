const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  time: string | { $date: string };
  read: boolean;
}

export const getNotifications = async (token: string) => {
  const res = await fetch(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const markAsRead = async (token: string, notificationId: string) => {
  const res = await fetch(
    `${API_URL}/notifications/mark-read/${notificationId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.json();
};

export const markAllAsRead = async (token: string) => {
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
};

export const deleteNotification = async (
  token: string,
  notificationId: string
) => {
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/notifications/schedule-reminder`,
    {
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
    }
  );

  if (!response.ok) {
    throw new Error("Error al agendar recordatorio");
  }

  return response.json();
};

export const getCronNotifications = async (token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/notifications`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();

  const cronNotifications = data.notifications.filter((n: Notification) =>
    [
      "holiday_reminder",
      "birthday_reminder",
      "subscription_expiring",
      "subscription_expired",
    ].includes(n.type)
  );

  return cronNotifications;
};
