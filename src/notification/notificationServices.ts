import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL; // tu backend base URL

export const getNotifications = async () => {
  const res = await axios.get(`${API_URL}/notifications`);
  return res.data;
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
