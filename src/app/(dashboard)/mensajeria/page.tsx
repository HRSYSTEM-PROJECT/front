// "use client";

// import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import axios, { AxiosError } from "axios";
// import Swal from "sweetalert2";
// import { useUser, useAuth } from "@clerk/nextjs";

// interface Message {
//   id: string;
//   chatId: string;
//   senderId: string;
//   content: string;
//   type: string;
//   created_at: string;
//   updated_at: string;
//   is_read: boolean;
//   deleted?: boolean;
// }

// interface Chat {
//   id: string;
//   users: string[];
//   messages: Message[];
// }

// export default function MensajeriaPage() {
//   const { user, isLoaded } = useUser();
//   const { getToken } = useAuth();

//   const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
//   const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   /* 🔌 SOCKET.IO CONNECTION */
//   useEffect(() => {
//     if (!isLoaded || !user) return;

//     const connectSocket = async () => {
//       try {
//         const token = await getToken();
//         if (!token) throw new Error("No se pudo obtener token de Clerk");

//         console.log("🔌 Conectando al socket:", SOCKET_URL + "/chat");

//         const socketInstance = io(`${SOCKET_URL}/chat`, {
//           auth: { token },
//           transports: ["websocket"],
//         });

//         socketInstance.on("connect", () => {
//           console.log("✅ Socket conectado:", socketInstance.id);
//         });

//         socketInstance.on("disconnect", (reason) => {
//           console.warn("⚠️ Socket desconectado:", reason);
//         });

//         socketInstance.on("new_message", (msg: Message) => {
//           console.log("💬 Nuevo mensaje recibido:", msg);
//           if (msg.chatId === selectedChat?.id)
//             setMessages((prev) => [...prev, msg]);
//         });

//         socketInstance.on("message_edited", (msg: Message) => {
//           setMessages((prev) =>
//             prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m))
//           );
//         });

//         socketInstance.on("message_deleted", (payload) => {
//           setMessages((prev) =>
//             prev.filter((m) => m.id !== payload.messageId)
//           );
//         });

//         socketInstance.on("messages_read", (payload) => {
//           setMessages((prev) =>
//             prev.map((m) =>
//               m.chatId === payload.chatId ? { ...m, is_read: true } : m
//             )
//           );
//         });

//         setSocket(socketInstance);

//         return () => {
//           socketInstance.disconnect();
//         };
//       } catch (err) {
//         console.error("Error conectando al socket:", err);
//       }
//     };

//     connectSocket();
//   }, [isLoaded, user, selectedChat?.id]);

//   /* 📥 CARGAR CHATS */
//   useEffect(() => {
//     if (!isLoaded) return;

//     const fetchChats = async () => {
//       try {
//         const token = await getToken();
//         if (!token) throw new Error("No se pudo obtener token de Clerk");
//         if (!BACKEND) throw new Error("BACKEND_URL no configurada");

//         const res = await axios.get(`${BACKEND}/chat?page=1&limit=20`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("✅ Chats obtenidos:", res.data);
//         setChats(res.data.chats || []);
//       } catch (err) {
//         const error = err as AxiosError;
//         console.error("🚨 Error al cargar chats:", error.message);
//         Swal.fire({
//           icon: "error",
//           title: "Error al cargar chats",
//           text:
//             (error.response?.data as any)?.message ||
//             "No se pudieron cargar los chats",
//         });
//       }
//     };

//     fetchChats();
//   }, [isLoaded]);

//   /* 📩 CARGAR MENSAJES DEL CHAT SELECCIONADO */
//   const loadMessages = async (chatId: string) => {
//     try {
//       const token = await getToken();
//       if (!token) throw new Error("No se pudo obtener token");

//       const res = await axios.get(`${BACKEND}/chat/${chatId}/messages`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       console.log("📦 Mensajes cargados:", res.data);
//       setMessages(res.data || []);
//     } catch (err) {
//       console.error("Error cargando mensajes:", err);
//     }
//   };

//   /* 🆕 CREAR NUEVO CHAT */
//   const handleCreateChat = async () => {
//     try {
//       const token = await getToken();
//       if (!token) throw new Error("No se pudo obtener token");
//       if (!BACKEND) throw new Error("BACKEND_URL no configurada");

//       const receiverId = prompt("Ingresá el ID del usuario con quien querés chatear:");
//       if (!receiverId) return;

//       const res = await axios.post(
//         `${BACKEND}/chat`,
//         { receiver_id: receiverId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log("🆕 Chat creado:", res.data);
//       setChats((prev) => [res.data, ...prev]);
//       Swal.fire("✅ Chat creado", "Se creó el chat correctamente", "success");
//     } catch (err) {
//       console.error("🚨 Error creando chat:", err);
//       Swal.fire("Error", "No se pudo crear el chat", "error");
//     }
//   };

//   /* ✉️ ENVIAR MENSAJE */
//   const handleSendMessage = () => {
//     if (!socket || !selectedChat || !newMessage.trim()) return;

//     const payload = {
//       chatId: selectedChat.id,
//       message: {
//         content: newMessage.trim(),
//         type: "text",
//       },
//     };

//     console.log("📤 Enviando mensaje:", payload);
//     socket.emit("send_message", payload);
//     setNewMessage("");
//   };

//   /* UI */
//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">💬 Mensajería en tiempo real</h1>

//       <div className="grid grid-cols-2 gap-4">
//         {/* Panel izquierdo */}
//         <div className="border rounded-lg p-4">
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="font-semibold">Tus chats</h2>
//             <button
//               className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
//               onClick={handleCreateChat}
//             >
//               ➕ Nuevo chat
//             </button>
//           </div>

//           <ul>
//             {chats.map((chat) => (
//               <li
//                 key={chat.id}
//                 className={`cursor-pointer hover:bg-gray-100 p-2 rounded ${
//                   selectedChat?.id === chat.id ? "bg-gray-200" : ""
//                 }`}
//                 onClick={() => {
//                   setSelectedChat(chat);
//                   loadMessages(chat.id);
//                 }}
//               >
//                 Chat: {chat.id}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Panel derecho */}
//         <div className="border rounded-lg p-4">
//           <h2 className="font-semibold mb-2">
//             {selectedChat
//               ? `Mensajes del chat ${selectedChat.id}`
//               : "Seleccioná un chat"}
//           </h2>

//           {selectedChat ? (
//             <>
//               <ul className="mb-4 h-64 overflow-y-auto border p-2 rounded">
//                 {messages.map((msg) => (
//                   <li key={msg.id} className="flex justify-between items-center">
//                     <span>
//                       <b>{msg.senderId === user?.id ? "Vos" : msg.senderId}:</b>{" "}
//                       {msg.content}
//                       {msg.is_read && (
//                         <span className="text-xs text-green-500"> ✔</span>
//                       )}
//                     </span>
//                   </li>
//                 ))}
//               </ul>

//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                 placeholder="Escribí un mensaje..."
//                 className="w-full border rounded p-2"
//               />
//             </>
//           ) : (
//             <p>Seleccioná un chat</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import io, { Socket } from "socket.io-client";
import Swal from "sweetalert2";
import { Send } from "lucide-react";

// 🌐 Variables de entorno
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const SOCKET_BASE = process.env.NEXT_PUBLIC_SOCKET_URL;

// 👥 Usuario básico
interface UserSummary {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  imgUrl?: string;
}

// 💬 Mensaje dentro de un chat
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

// 💭 Chat entre usuarios
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
  const [newChatUserId, setNewChatUserId] = useState("");

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
        auth: { token }, 
        transports: ["websocket"],
      });

      socket.on("connect", () => console.log("🟢 Conectado al WebSocket /chat"));
      socket.on("disconnect", () => console.warn("🔴 Desconectado del WebSocket"));
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

  // Obtener los chats del backend
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
        console.error("🚨 Error al cargar chats:", error.message);
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

  // ✉️ Enviar mensaje
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

  // ➕ Crear nuevo chat
  const handleCreateChat = async () => {
    if (!newChatUserId.trim()) return;

    try {
      const token = await getToken();
      const res = await axios.post(
        `${BACKEND}/chat`,
        { userId: newChatUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChats((prev) => [...prev, res.data]);
      setNewChatUserId("");
      Swal.fire("Chat creado", "Ya podés empezar a chatear", "success");
    } catch (err) {
      console.error("Error al crear chat:", err);
      Swal.fire("Error", "No se pudo crear el chat", "error");
    }
  };

  useEffect(scrollToBottom, [selectedChat]);

  // 💬 Interfaz principal
  return (
    <div className="flex h-[85vh] rounded-xl shadow-lg bg-white overflow-hidden border border-gray-200">
      {/* Sidebar de chats */}
      <aside className="w-1/3 border-r bg-gray-50 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-3">💬 Chats</h2>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Ingresá el ID del usuario"
            value={newChatUserId}
            onChange={(e) => setNewChatUserId(e.target.value)}
            className="flex-1 border rounded-lg px-2 py-1 text-sm"
          />
          <button
            onClick={handleCreateChat}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm"
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
              const otherUser = chat.participants.find(
                (p) => p.id !== user?.id
              );
              return (
                <li
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
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
              {selectedChat.participants
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