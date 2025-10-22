"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import io, { Socket } from "socket.io-client";
import Swal from "sweetalert2";
import { Send } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const SOCKET_BASE = process.env.NEXT_PUBLIC_SOCKET_URL;

interface UserSummary {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  imgUrl?: string;
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file" | "system";
  reply_to_id?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  created_at: string;
  updated_at: string;
  is_read?: boolean;
}

interface Chat {
  id: string;
  participants: UserSummary[];
  messages: Message[];
  createdAt: string;
  updatedAt?: string;
}

export default function MensajeriaPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isLoaded || !SOCKET_BASE) return;

    const connectSocket = async () => {
      const token = await getToken();
      if (!token) return console.error("❌ No se pudo obtener token de Clerk");

      const socket = io(`${SOCKET_BASE}/chat`, {
        auth: { token }, // ✅ el back lo espera en handshake.auth.token
        transports: ["websocket"],
      });

      socket.on("connect", () =>
        console.log("🟢 Conectado al WebSocket /chat")
      );
      socket.on("disconnect", () =>
        console.warn("🔴 Desconectado del WebSocket")
      );
      socket.on("connect_error", (err) =>
        console.error("⚠️ Error de conexión:", err.message)
      );

      socket.on("new_message", (msg: Message) => {
        console.log("📩 Nuevo mensaje recibido:", msg);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === msg.chatId
              ? { ...chat, messages: [...chat.messages, msg] }
              : chat
          )
        );
        scrollToBottom();
      });

      socketRef.current = socket;
    };

    connectSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchChats = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No se pudo obtener token de Clerk");
        if (!BACKEND) throw new Error("BACKEND_URL no configurada");

        const res = await axios.get(`${BACKEND}/chat?page=1&limit=20`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Chats obtenidos:", res.data);
        const usuarios =
          res.data.users || res.data.data || res.data.results || [];

        setUsers(usuarios);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("🚨 Error al cargar chats:", error.message);

        Swal.fire({
          icon: "error",
          title: "Error al cargar chats",
          text:
            error.response?.data?.message || "No se pudieron cargar los chats",
        });
      }
    };

    fetchChats();
  }, [isLoaded]);

  // Cargar usuarios de la empresa
  useEffect(() => {
    if (!isLoaded) return;

    const fetchUsers = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No se pudo obtener token de Clerk");
        if (!BACKEND) throw new Error("BACKEND_URL no configurada");

        const res = await axios.get(`${BACKEND}/chat?page=1&limit=20`, {
  headers: { Authorization: `Bearer ${token}` },
});

console.log("✅ Chats obtenidos:", res.data);

let chats: Chat[] = [];

if (Array.isArray(res.data)) {
  chats = res.data;
} else if (Array.isArray(res.data.chats)) {
  chats = res.data.chats;
} else if (Array.isArray(res.data.results)) {
  chats = res.data.results;
} else if (Array.isArray(res.data.data)) {
  chats = res.data.data;
} else if (Array.isArray(res.data.data?.chats)) {
  chats = res.data.data.chats;
}

setChats(chats);
        // const res = await axios.get(
        //   `${BACKEND}/chat/users/search?q=&page=1&limit=50`,
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }
        // );

        // console.log("✅ Usuarios obtenidos:", res.data);

        // const usuarios =
        //   res.data.users || res.data.data || res.data.results || [];

        // setUsers(usuarios);
      } catch (err) {
        console.error("🚨 Error al cargar usuarios:", err);
      }
    };

    fetchUsers();
  }, [isLoaded]);

  //  Enviar mensaje
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !socketRef.current) return;

    const payload = {
      chatId: selectedChat.id,
      message: {
        content: newMessage.trim(),
        type: "text",
      },
    };

    console.log("📤 Enviando mensaje:", payload);
    socketRef.current.emit("send_message", payload);
    setNewMessage("");
  };

  //  Crear nuevo chat
  const handleCreateChat = async () => {
    if (!selectedUserId.trim()) return;

    try {
      const token = await getToken();
      if (!token) throw new Error("No se pudo obtener token de Clerk");
      if (!BACKEND) throw new Error("BACKEND_URL no configurada");

      const res = await axios.post(
        `${BACKEND}/chat/direct/${selectedUserId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChats((prev) => [...prev, res.data]);
      setSelectedUserId("");

      // Unirse automáticamente al chat creado
      if (socketRef.current) {
        socketRef.current.emit("join_chat", { chatId: res.data.id });
        console.log(`🔗 Uniéndose al chat recién creado ${res.data.id}`);
      }

      Swal.fire("Chat creado", "Ya podés empezar a chatear", "success");
    } catch (err) {
      console.error("Error al crear chat:", err);
      Swal.fire("Error", "No se pudo crear el chat", "error");
    }
  };

  // Función para manejar selección de chat
  const handleSelectChat = (chat: Chat) => {
    // Salir del chat anterior si existe
    if (selectedChat && socketRef.current) {
      socketRef.current.emit("leave_chat", { chatId: selectedChat.id });
      console.log(`🚪 Saliendo del chat ${selectedChat.id}`);
    }

    setSelectedChat(chat);

    // Unirse al nuevo chat
    if (socketRef.current) {
      socketRef.current.emit("join_chat", { chatId: chat.id });
      console.log(`🔗 Uniéndose al chat ${chat.id}`);
    }
  };

  useEffect(scrollToBottom, [selectedChat]);

  return (
    <div className="flex h-[85vh] rounded-xl shadow-lg bg-white overflow-hidden border border-gray-200">
      {/* Sidebar de chats */}
      <aside className="w-1/3 border-r bg-gray-50 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-3">💬 Chats</h2>

        <div className="flex gap-2 mb-3">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 border rounded-lg px-2 py-1 text-sm"
          >
            <option value="">Seleccioná un usuario...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name} ({user.email})
              </option>
            ))}
          </select>
          <button
            onClick={handleCreateChat}
            disabled={!selectedUserId}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm"
          >
            +
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <p className="text-sm text-gray-500 text-center mt-5">
              No hay chats aún.
            </p>
          ) : (
            chats.map((chat) => {
              const participants = chat.participants || [];
              const otherUser = participants.find((p) => p.id !== user?.id);
              return (
                <li
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`p-2 mb-1 rounded-lg cursor-pointer ${
                    selectedChat?.id === chat.id
                      ? "bg-blue-100 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {otherUser
                    ? `${otherUser.first_name || "Usuario"} ${
                        otherUser.last_name || ""
                      }`
                    : "Chat desconocido"}
                </li>
              );
            })
          )}
        </ul>
      </aside>

      {/* Ventana del chat */}
      <main className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="border-b p-3 font-semibold bg-gray-50">
              Chat con{" "}
              {(selectedChat.participants || [])
                .filter((p) => p.id !== user?.id)
                .map((p) => p.first_name || p.id)
                .join(", ") || "Desconocido"}
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {selectedChat.messages.length === 0 ? (
                <p className="text-center text-gray-400 mt-10 text-sm">
                  No hay mensajes todavía. ¡Escribí el primero!
                </p>
              ) : (
                selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 flex ${
                      msg.senderId === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                        msg.senderId === user?.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className="block text-[10px] mt-1 opacity-70 text-right">
                        {new Date(msg.created_at).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-3 flex gap-2">
              <input
                type="text"
                placeholder="Escribí un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Seleccioná un chat o creá uno nuevo
          </div>
        )}
      </main>
    </div>
  );
}
