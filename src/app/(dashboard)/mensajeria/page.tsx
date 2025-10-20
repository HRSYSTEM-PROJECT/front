"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useUser, useAuth } from "@clerk/nextjs";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  deleted?: boolean;
}

interface Chat {
  id: string;
  users: string[];
  messages: Message[];
}

export default function MensajeriaPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  /*  SOCKET.IO CONNECTION  */
  useEffect(() => {
    if (!isLoaded || !user) return;

    const connectSocket = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No se pudo obtener token de Clerk");

        console.log("🔌 Conectando al socket:", SOCKET_URL + "/chat");

        const socketInstance = io(`${SOCKET_URL}/chat`, {
          auth: { token: token },
          transports: ["websocket"],
        });

        socketInstance.on("connect", () => {
          console.log("✅ Socket conectado:", socketInstance.id);
        });

        socketInstance.on("disconnect", (reason) => {
          console.warn("⚠️ Socket desconectado:", reason);
        });

        /* EVENTOS QUE ENVÍA EL BACK  */
        socketInstance.on("new_message", (msg: Message) => {
          console.log("💬 Nuevo mensaje recibido:", msg);
          if (msg.chatId === selectedChat?.id)
            setMessages((prev) => [...prev, msg]);
        });

        socketInstance.on("message_edited", (msg: Message) => {
          console.log("✏️ Mensaje editado:", msg);
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m))
          );
        });

        socketInstance.on("message_deleted", (payload) => {
          console.log(" Mensaje eliminado:", payload);
          setMessages((prev) =>
            prev.filter((m) => m.id !== payload.messageId)
          );
        });

        socketInstance.on("messages_read", (payload) => {
          console.log(" Mensajes marcados como leídos:", payload);
          setMessages((prev) =>
            prev.map((m) =>
              m.chatId === payload.chatId ? { ...m, is_read: true } : m
            )
          );
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
        };
      } catch (err) {
        console.error("Error conectando al socket:", err);
      }
    };

    connectSocket();
  }, [isLoaded, user, selectedChat?.id]);

  /*  CARGAR CHATS (REST) */
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
        setChats(res.data.chats || []);
      } catch (err) {
        const error = err as AxiosError;
        console.error(" Error al cargar chats:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error al cargar chats",
          text:
            (error.response?.data as any)?.message ||
            "No se pudieron cargar los chats",
        });
      }
    };

    fetchChats();
  }, [isLoaded]);

  /* CARGAR MENSAJES DEL CHAT SELECCIONADO  */
  const loadMessages = async (chatId: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("No se pudo obtener token");

      const res = await axios.get(`${BACKEND}/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },

      });

      console.log(" Mensajes cargados:", res.data);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error cargando mensajes:", err);
    }
  };

  /* ---------- ENVIAR MENSAJE ---------- */
  const handleSendMessage = () => {
    if (!socket || !selectedChat || !newMessage.trim()) return;

    const payload = {
      chatId: selectedChat.id,
      message: {
        content: newMessage.trim(),
        type: "text",
      },
    };

    console.log("📤 Enviando mensaje:", payload);
    socket.emit("send_message", payload);
    setNewMessage("");
  };

  /* ---------- EDITAR MENSAJE ---------- */
  const handleEditMessage = (msgId: string, newContent: string) => {
    if (!socket) return;
    socket.emit("edit_message", {
      messageId: msgId,
      content: newContent,
    });
    console.log(" Mensaje editado:", msgId);
  };

  /* ---------- ELIMINAR MENSAJE ---------- */
  const handleDeleteMessage = (msgId: string) => {
    if (!socket) return;
    socket.emit("delete_message", { messageId: msgId });
    console.log(" Eliminando mensaje:", msgId);
  };

  /* ---------- MARCAR COMO LEÍDO ---------- */
  const handleMarkAsRead = (chatId: string) => {
    if (!socket) return;
    socket.emit("mark_as_read", { chatId });
    console.log("👁️ Marcando como leído:", chatId);
  };

  /* ---------- UNIRSE A UN CHAT ---------- */
  const handleJoinChat = (chatId: string) => {
    if (!socket) return;
    socket.emit("join_chat", { chatId });
    console.log(" Unido al chat:", chatId);
  };

  /* ---------- SALIR DE UN CHAT ---------- */
  const handleLeaveChat = (chatId: string) => {
    if (!socket) return;
    socket.emit("leave_chat", { chatId });
    console.log(" Saliste del chat:", chatId);
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">💬 Mensajería en tiempo real</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Tus chats</h2>
          <ul>
            {chats.map((chat) => (
              <li
                key={chat.id}
                className={`cursor-pointer hover:bg-gray-100 p-2 rounded ${
                  selectedChat?.id === chat.id ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat);
                  handleJoinChat(chat.id);
                  loadMessages(chat.id);
                }}
              >
                Chat: {chat.id}
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">
            {selectedChat ? `Mensajes del chat ${selectedChat.id}` : "Seleccioná un chat"}
          </h2>

          {selectedChat ? (
            <>
              <ul className="mb-4 h-64 overflow-y-auto border p-2 rounded">
                {messages.map((msg) => (
                  <li key={msg.id} className="flex justify-between items-center">
                    <span>
                      <b>{msg.senderId === user?.id ? "Vos" : msg.senderId}:</b>{" "}
                      {msg.content}
                      {msg.is_read && <span className="text-xs text-green-500"> ✔</span>}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 text-xs"
                        onClick={() =>
                          handleEditMessage(msg.id, prompt("Nuevo contenido:", msg.content) || msg.content)
                        }
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-600 text-xs"
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder="Escribí un mensaje..."
                className="w-full border rounded p-2"
              />

              <div className="flex gap-2 mt-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleMarkAsRead(selectedChat.id)}
                >
                  Marcar como leído
                </button>
                <button
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                  onClick={() => handleLeaveChat(selectedChat.id)}
                >
                  Salir del chat
                </button>
              </div>
            </>
          ) : (
            <p>Seleccioná un chat</p>
          )}
        </div>
      </div>
    </div>
  );
}