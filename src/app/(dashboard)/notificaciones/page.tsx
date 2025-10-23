"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Bell, Calendar, Trash2 } from "lucide-react";
import {
  deleteNotification,
  deleteScheduledReminder,
  getCronNotifications,
  getNotifications,
  getScheduledReminders,
  scheduleReminder,
} from "@/notification/notificationServices";
import { toast } from "react-toastify";
import Select from "react-select";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  time: string;
  is_read: boolean;
}

interface Empleado {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface ScheduledReminder {
  id: string;
  title: string;
  message: string;
  scheduled_date: string;
}

export default function NotificationsPage() {
  const { getToken } = useAuth();

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [cronEvents, setCronEvents] = useState<Notification[]>([]);
  const [scheduledReminders, setScheduledReminders] = useState<
    ScheduledReminder[]
  >([]);
  const [reminder, setReminder] = useState({
    title: "",
    message: "",
    scheduledDate: "",
  });

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const data = await getNotifications(token!);
      setNotifications(data.notifications || data || []);
    } catch (err) {
      console.error("Error cargando notificaciones:", err);
      toast.error("No se pudieron cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const loadCronEvents = async () => {
    try {
      const token = await getToken();
      const events = await getCronNotifications(token!);
      setCronEvents(events || []);
    } catch (err) {
      console.error("Error cargando eventos automáticos:", err);
      toast.error("No se pudieron cargar los eventos automáticos");
    }
  };

  const loadScheduledReminders = async () => {
    try {
      const token = await getToken();
      const data = await getScheduledReminders(token!);
      setScheduledReminders(data.scheduledReminders || data || []);
    } catch (err) {
      console.error("Error cargando recordatorios programados:", err);
      toast.error("No se pudieron cargar los recordatorios");
    }
  };

const loadEmpleados = async () => {
  try {
    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/empleado/byCompany`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("Error al obtener empleados");
    const data = await res.json();
    console.log("📦 Respuesta empleados:", data);

    // data ya es un array de empleados, no usar data.empleados
    setEmpleados(data);
  } catch (err) {
    console.error("❌ Error al cargar empleados:", err);
  }
};

  useEffect(() => {
    loadNotifications();
    loadCronEvents();
    loadScheduledReminders();
    loadEmpleados();
  }, []);

  // const handleMarkAsRead = async (id: string) => {
  //   try {
  //     const token = await getToken();
  //     await markAsRead(token!, id, user!.id);
  //     setNotifications((prev) =>
  //       prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
  //     );
  //     toast.success("Notificación marcada como leída");
  //   } catch (error) {
  //     console.error("Error al marcar como leída:", error);
  //   }
  // };

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

  const handleScheduleReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const selectedEmployees = empleados.filter((emp) =>
        selectedEmails.includes(emp.id)
      );

      const recipientEmails = selectedEmployees.map((emp) => emp.email);

      await scheduleReminder(
        token!,
        reminder.title,
        reminder.message,
        reminder.scheduledDate,
        {
          recipientEmails,
          recipientEmployeeIds: selectedEmails,
        }
      );

      toast.success("Recordatorio programado correctamente");
      setReminder({ title: "", message: "", scheduledDate: "" });
      setSelectedEmails([]);
      loadScheduledReminders();
    } catch (error) {
      toast.error("Error al programar el recordatorio");
      console.error(error);
    }
  };
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
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
              <Bell className="text-[#083E96] w-7 h-7" /> Notificaciones
            </h1>
          </div>

          <div className="min-h-[200px] max-h-[60vh] overflow-y-auto pr-2">
            {loading ? (
              <p className="text-gray-500 text-center py-10">
                Cargando notificaciones...
              </p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <p className="text-gray-500 italic text-lg">
                  No hay notificaciones.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`group flex justify-between items-start p-5 border-l-4 rounded-xl transition duration-300 ease-in-out cursor-pointer hover:shadow-md ${
                      n.is_read
                        ? "bg-gray-100 border-l-gray-200"
                        : "bg-blue-50 border-l-[#083E96]"
                    }`}
                  >
                    <div className="flex-grow">
                      <h3
                        className={`font-bold text-lg ${
                          n.is_read ? "text-gray-600" : "text-gray-800"
                        }`}
                      >
                        {n.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{n.message}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(n.time).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 cursor-pointer"
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

          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {" "}
              Recordatorios Programados
            </h3>
            {scheduledReminders.length === 0 ? (
              <p className="text-gray-500 italic mt-2">
                No hay recordatorios programados
              </p>
            ) : (
              <ul className="space-y-3">
                {scheduledReminders.map((rem) => (
                  <li
                    key={rem.id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold">{rem.title}</h4>
                      <p className="text-gray-600">{rem.message}</p>
                      <span className="text-sm text-gray-400">
                        Programado para:{" "}
                        {new Date(rem.scheduled_date).toLocaleString()}
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

        <form
          onSubmit={handleScheduleReminder}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 self-start"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-[#083E96] w-5 h-5" /> Programar
            recordatorio
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Título"
              value={reminder.title}
              onChange={(e) =>
                setReminder((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none"
              required
            />
            <textarea
              placeholder="Mensaje"
              value={reminder.message}
              onChange={(e) =>
                setReminder((prev) => ({ ...prev, message: e.target.value }))
              }
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
            <Select
              isMulti
              options={empleados.map((emp) => ({
                value: emp.email,
                label: `${emp.first_name} ${emp.last_name} (${emp.email})`,

              }))}
              onChange={(selected) =>
                setSelectedEmails(selected.map((s) => s.value))
              }
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-[#083E96] hover:bg-[#0a4ebb] text-white px-6 py-2.5 rounded-lg transition duration-200 font-medium w-full shadow-md cursor-pointer"
          >
            Agendar recordatorio
          </button>
        </form>
      </div>
    </div>
  );
}
