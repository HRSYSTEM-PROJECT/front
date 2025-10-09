"use client";

import { useState } from "react";
import { Bell, Trash2, CheckCircle2, Calendar, AlertCircle, UserPlus, DollarSign, TrendingUp } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "employee" | "absence" | "alert" | "payroll" | "productivity" | "update" | "evaluation";
  read: boolean;
}

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Nuevo empleado registrado",
      message: "María González ha sido agregada al sistema como Desarrolladora Senior",
      time: "Hace 5 minutos",
      type: "employee",
      read: false,
    },
    {
      id: 2,
      title: "Ausencia registrada",
      message: "Juan Pérez marcó ausencia para el día de hoy",
      time: "Hace 1 hora",
      type: "absence",
      read: false,
    },
    {
      id: 3,
      title: "Alerta de ausencias",
      message: "El departamento de Ventas tiene un 15% de ausencias este mes",
      time: "Hace 2 horas",
      type: "alert",
      read: false,
    },
    {
      id: 4,
      title: "Nómina procesada",
      message: "La nómina del mes de enero ha sido procesada exitosamente",
      time: "Hace 3 horas",
      type: "payroll",
      read: true,
    },
    {
      id: 5,
      title: "Reporte de productividad",
      message: "La productividad general aumentó un 5% este mes",
      time: "Hace 5 horas",
      type: "productivity",
      read: true,
    },
    {
      id: 6,
      title: "Actualización de categoría",
      message: "Ana Martínez fue promovida a Senior Designer",
      time: "Hace 1 día",
      type: "employee",
      read: true,
    },
    {
      id: 7,
      title: "Recordatorio de evaluación",
      message: "Tienes 3 evaluaciones de desempeño pendientes",
      time: "Hace 1 día",
      type: "evaluation",
      read: true,
    },
  ]);

  const markAllAsRead = () => setNotifications((prev) => prev.map((notificacion) => ({ ...notificacion, read: true })));

  const deleteAll = () => setNotifications([]);

  const markAsRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((notificacion) => (notificacion.id === id ? { ...notificacion, read: true } : notificacion))
    );

  const deleteNotification = (id: number) =>
    setNotifications((prev) => prev.filter((notificacion) => notificacion.id !== id));

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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600 text-sm">Mantente al día con las actualizaciones del sistema</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
          >
            <CheckCircle2 className="w-4 h-4" /> Marcar todas como leídas
          </button>
          <button
            onClick={deleteAll}
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
                  <button onClick={() => markAsRead(n.id)} className="text-sm text-blue-700 hover:underline block">
                    Marcar como leída
                  </button>
                )}
                <button onClick={() => deleteNotification(n.id)} className="text-sm text-red-600 hover:underline block">
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Configuración */}
      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold mb-1">Notificaciones por Email</p>
            <p className="text-gray-600 mb-2">Recibe resúmenes diarios en tu correo.</p>
            <button className="border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100">Configurar</button>
          </div>
          <div>
            <p className="font-semibold mb-1">Alertas Importantes</p>
            <p className="text-gray-600 mb-2">Notificaciones de eventos críticos.</p>
            <button className="border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100">Configurar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
