"use client";

import { useEffect, useState } from "react";
import { Bell, Trash2, CheckCircle2, Calendar, AlertCircle, UserPlus, DollarSign, TrendingUp } from "lucide-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../../../notification/notificationServices";
import { useAuth } from "@clerk/nextjs";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "employee" | "absence" | "alert" | "payroll" | "productivity" | "update" | "evaluation";
  read: boolean;
}

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const authToken = await getToken();
        const data = await getNotifications(authToken);
        console.log("hola mundo");
        setNotifications(data);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((notificacion) => (notificacion.id === id ? { ...notificacion, read: true } : notificacion))
      );
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((notificacion) => ({ ...notificacion, read: true })));
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((notificacion) => notificacion.id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error("Error al eliminar todas:", error);
    }
  };

  const getIcon = (type: Notification["type"]) => {
    const base = "w-6 h-6 p-1.5 rounded-md";
    switch (type) {
      case "employee":
        return <UserPlus className={`${base} text-blue-600 bg-blue-100`} />;
      case "absence":
        return <Calendar className={`${base} text-green-600 bg-green-100`} />;
      case "alert":
        return <AlertCircle className={`${base} text-red-600 bg-red-100`} />;
      case "payroll":
        return <DollarSign className={`${base} text-orange-600 bg-orange-100`} />;
      case "productivity":
        return <TrendingUp className={`${base} text-green-600 bg-green-100`} />;
      case "update":
        return <AlertCircle className={`${base} text-orange-600 bg-orange-100`} />;
      default:
        return <Bell className={`${base} text-gray-600 bg-gray-100`} />;
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Cargando notificaciones...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600 text-sm">Mantente al día con las actualizaciones del sistema</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
          >
            <CheckCircle2 className="w-4 h-4" /> Marcar todas como leídas
          </button>
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
          >
            <Trash2 className="w-4 h-4" /> Eliminar todas
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Bell className="mx-auto w-10 h-10 mb-3 text-gray-400" />
            No tienes notificaciones.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between p-4 rounded-lg border transition ${
                n.read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex gap-3">
                {getIcon(n.type)}
                <div>
                  <h3 className="font-semibold text-gray-900">{n.title}</h3>
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="text-sm text-blue-700 hover:underline block"
                  >
                    Marcar como leída
                  </button>
                )}
                <button onClick={() => handleDelete(n.id)} className="text-sm text-red-600 hover:underline block">
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
