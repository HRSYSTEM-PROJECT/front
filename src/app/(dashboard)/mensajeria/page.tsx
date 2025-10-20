"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { io, Socket } from "socket.io-client";
import Swal from "sweetalert2";
import { Send, Edit2, Trash2 } from "lucide-react";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file" | "system";
  created_at: string;
  updated_at: string;
  is_read: boolean;
}

export default function MensajeriaPage() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState<string>("");

  // 📦 Conexión al socket
  useEffect(() => {
    const connectSocket = async () => {
      try {
        const token = await getToken();
        if (!token) {
          Swal.fire("Error", "No se pudo obtener el token de Clerk", "error");
          return;
        }

        const SOCKET_URL =
          process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:4000";

        const newSocket = io(SOCKET_URL + "/chat", {
          auth: { token },
          transports: ["websocket"],
        });

        newSocket.on("connect", () => {
          console.log("✅ Conectado al WebSocket");
          setConnected(true);
        });

        // 🔹 Mensaje nuevo
        newSocket.on("new_message", (msg: Message) => {
          setMessages((prev) => [...prev, msg]);
        });

        // 🔹 Mensaje editado
        newSocket.on("message_edited", (msg: Message) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m))
          );
        });

        // 🔹 Mensaje eliminado
        newSocket.on("message_deleted", (data: { messageId: string }) => {
          setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
        });

        newSocket.on("disconnect", () => {
          setConnected(false);
          console.warn("🔴 Desconectado del WebSocket");
        });

        setSocket(newSocket);
        return () => newSocket.disconnect();
      } catch (err) {
        console.error("Error al conectar socket:", err);
      }
    };

    connectSocket();
  }, [getToken]);

  // 📩 Enviar mensaje
  const handleSend = () => {
    if (!socket || !newMessage.trim() || !chatId) {
      Swal.fire("Atención", "Seleccioná un chat y escribí un mensaje", "info");
      return;
    }

    const payload = {
      chatId,
      message: {
        content: newMessage.trim(),
        type: "text",
      },
    };

    socket.emit("send_message", payload);
    setNewMessage("");
  };

  // ✏️ Editar mensaje
  const handleEdit = async (message: Message) => {
    const { value: newContent } = await Swal.fire({
      title: "Editar mensaje",
      input: "text",
      inputValue: message.content,
      showCancelButton: true,
      confirmButtonText: "Guardar",
    });

    if (newContent && socket) {
      socket.emit("edit_message", {
        messageId: message.id,
        content: newContent,
      });
    }
  };

  // 🗑️ Eliminar mensaje
  const handleDelete = (id: string) => {
    if (socket) socket.emit("delete_message", { messageId: id });
  };

  // 🔹 Entrar al chat (una sola vez)
  const joinChat = (chat: string) => {
    if (!socket) return;
    setChatId(chat);
    socket.emit("join_chat", { chatId: chat });
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[90vh] items-center justify-start p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-2">💬 Mensajería</h1>
      <p
        className={`text-sm mb-4 ${
          connected ? "text-green-600" : "text-red-500"
        }`}
      >
        {connected ? "Conectado ✅" : "Desconectado ❌"}
      </p>

      {/* 🔹 Selector de chat (simulado) */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => joinChat("chat-uuid-1")}
          className={`px-4 py-2 rounded-lg border ${
            chatId === "chat-uuid-1" ? "bg-blue-500 text-white" : ""
          }`}
        >
          Chat 1
        </button>
        <button
          onClick={() => joinChat("chat-uuid-2")}
          className={`px-4 py-2 rounded-lg border ${
            chatId === "chat-uuid-2" ? "bg-blue-500 text-white" : ""
          }`}
        >
          Chat 2
        </button>
      </div>

      {/* 🔹 Mensajes */}
      <div className="flex flex-col w-full max-w-2xl border rounded-lg bg-white shadow h-[60vh] overflow-y-auto p-3">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex justify-between items-center mb-2 ${
                msg.senderId === user?.id ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`${
                  msg.senderId === user?.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                } px-3 py-2 rounded-lg flex-1`}
              >
                <p>{msg.content}</p>
                <p className="text-[10px] opacity-70">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>

              {msg.senderId === user?.id && (
                <div className="flex gap-2 ml-2">
                  <button onClick={() => handleEdit(msg)}>
                    <Edit2 size={16} className="text-gray-500" />
                  </button>
                  <button onClick={() => handleDelete(msg.id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">
            No hay mensajes aún.
          </p>
        )}
      </div>

      {/* 🔹 Input */}
      <div className="flex w-full max-w-2xl mt-4">
        <input
          type="text"
          value={newMessage}
          placeholder="Escribe tu mensaje..."
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-l-lg p-2 outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}