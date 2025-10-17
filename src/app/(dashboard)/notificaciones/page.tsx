"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Bell, Calendar, CheckCircle, Trash2 } from "lucide-react";
import {
  deleteNotification,
  deleteScheduledReminder,
  getCronNotifications,
  getNotifications,
  getScheduledReminders,
  markAllAsRead,
  markAsRead,
  scheduleReminder,
} from "@/notification/notificationServices";
import { toast } from "react-toastify";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  time: string;
  read: boolean;
}

interface ScheduledReminder {
  id: string;
  title: string;
  message: string;
  scheduled_date: string;
}

export default function NotificationsPage() {
  const { getToken } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [cronEvents, setCronEvents] = useState<Notification[]>([]);
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>([]);

  const [reminder, setReminder] = useState({
    title: "",
    message: "",
    scheduledDate: "",
  });

  //  Cargar notificaciones normales
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const data = await getNotifications(token!);
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Error cargando notificaciones:", err);
      toast.error("No se pudieron cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  //  Cargar eventos automáticos (cron)
  const loadCronEvents = async () => {
    try {
      const token = await getToken();
      const events = await getCronNotifications(token!);
      setCronEvents(events);
    } catch (err) {
      console.error("Error cargando eventos automáticos:", err);
      toast.error("No se pudieron cargar los eventos automáticos");
    }
  };

  //  Cargar recordatorios programados
  const loadScheduledReminders = async () => {
    try {
      const token = await getToken();
      const data = await getScheduledReminders(token!);
      setScheduledReminders(data.scheduledReminders || []);
    } catch (err) {
      console.error("Error cargando recordatorios programados:", err);
      toast.error("No se pudieron cargar los recordatorios");
    }
  };

  useEffect(() => {
    loadNotifications();
    loadCronEvents();
    loadScheduledReminders();
  }, []);

  //  Marcar una como leída
  const handleMarkAsRead = async (id: string) => {
    try {
      const token = await getToken();
      await markAsRead(token!, id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  //  Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      const token = await getToken();
      await markAllAsRead(token!);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  };

  //  Eliminar notificación normal
  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      await deleteNotification(token!, id);
      toast.success("Notificación eliminada");
      loadNotifications();
    } catch {
      toast.error("Error al eliminar la notificación");
    }
  };

  //  Programar un recordatorio
  const handleScheduleReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      await scheduleReminder(token!, reminder.title, reminder.message, reminder.scheduledDate);
      toast.success("Recordatorio programado correctamente");
      setReminder({ title: "", message: "", scheduledDate: "" });
      loadScheduledReminders();
    } catch (error) {
      toast.error("Error al programar el recordatorio");
      console.error(error);
    }
  };

  //  Eliminar recordatorio programado
  const handleDeleteScheduled = async (id: string) => {
    try {
      const token = await getToken();
      await deleteScheduledReminder(token!, id);
      toast.success("Recordatorio eliminado");
      loadScheduledReminders();
    } catch {
      toast.error("Error al eliminar el recordatorio");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel principal */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          {/* Título y botón */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
              <Bell className="text-[#083E96] w-7 h-7" /> Notificaciones
            </h1>
            <button
              onClick={handleMarkAllAsRead}
              className="bg-[#083E96] hover:bg-[#0a4ebb] text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md hover:shadow-lg"
            >
              Marcar como leídas
            </button>
          </div>

          {/* Lista de notificaciones */}
          <div className="min-h-[200px] max-h-[60vh] overflow-y-auto pr-2">
            {loading ? (
              <p className="text-gray-500 text-center py-10">Cargando notificaciones...</p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <p className="text-gray-500 italic text-lg"> ¡Todo limpio! No hay notificaciones registradas.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`group flex justify-between items-start p-5 border-l-4 rounded-xl transition duration-300 ease-in-out cursor-pointer hover:shadow-md ${
                      n.read ? "bg-gray-100 border-l-gray-200" : "bg-blue-50 border-l-[#083E96]"
                    }`}
                  >
                    <div className="flex-grow">
                      <h3 className={`font-bold text-lg ${n.read ? "text-gray-600" : "text-gray-800"}`}>{n.title}</h3>
                      <p className="text-gray-600 mt-1">{n.message}</p>
                      <p className="text-gray-400 text-xs mt-2">{new Date(n.time).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {!n.read && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-50"
                          title="Marcar como leída"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                        title="Eliminar notificación"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Eventos automáticos */}
          <div className="mt-10 mb-10">
            <h3 className="text-xl font-bold text-gray-800 mb-2">🔄 Eventos Automáticos</h3>
            {cronEvents.length === 0 ? (
              <p className="text-gray-500 italic mt-2">No hay eventos automáticos</p>
            ) : (
              cronEvents.map((event) => (
                <div key={event.id} className="cron-event border-b py-2">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-gray-600">{event.message}</p>
                  <span className="text-gray-400 text-sm">{new Date(event.time).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>

          {/* Recordatorios programados */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-800 mb-2">🕒 Recordatorios Programados</h3>
            {scheduledReminders.length === 0 ? (
              <p className="text-gray-500 italic mt-2">No hay recordatorios programados</p>
            ) : (
              <ul className="space-y-3">
                {scheduledReminders.map((rem) => (
                  <li key={rem.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{rem.title}</h4>
                      <p className="text-gray-600">{rem.message}</p>
                      <span className="text-sm text-gray-400">
                        Programado para: {new Date(rem.scheduled_date).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteScheduled(rem.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar recordatorio"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Formulario de recordatorio */}
        <form
          onSubmit={handleScheduleReminder}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 self-start"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-[#083E96] w-5 h-5" /> Programar recordatorio
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Título"
              value={reminder.title}
              onChange={(e) => setReminder((prev) => ({ ...prev, title: e.target.value }))}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none"
              required
            />
            <textarea
              placeholder="Mensaje"
              value={reminder.message}
              onChange={(e) => setReminder((prev) => ({ ...prev, message: e.target.value }))}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none resize-none"
              rows={3}
              required
            />
            <input
              type="datetime-local"
              value={reminder.scheduledDate}
              onChange={(e) =>
                setReminder((prev) => ({
                  ...prev,
                  scheduledDate: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-[#083E96] hover:bg-[#0a4ebb] text-white px-6 py-2.5 rounded-lg transition duration-200 font-medium w-full shadow-md"
          >
            Agendar recordatorio
          </button>
        </form>
      </div>
    </div>
  );
}
