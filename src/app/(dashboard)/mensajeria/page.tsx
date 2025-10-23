"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import io, { Socket } from "socket.io-client";
import Swal from "sweetalert2";
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react";

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
  unreadCount?: number;
}

export default function MensajeriaPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Conectar WebSocket
  useEffect(() => {
    if (!isLoaded || !SOCKET_BASE) return;

    const connectSocket = async () => {
      // ✅ Obtener token fresco con skipCache para evitar tokens expirados
      const token = await getToken({ skipCache: true });
      if (!token) return console.error("❌ No se pudo obtener token de Clerk");

      console.log("🔑 Token obtenido para WebSocket");

      const socket = io(`${SOCKET_BASE}/chat`, {
        auth: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => console.log("🟢 Conectado al WebSocket /chat"));
      socket.on("disconnect", () => console.warn("🔴 Desconectado del WebSocket"));
      socket.on("connect_error", async (err) => {
        console.error("⚠️ Error de conexión:", err.message);
        
        // Si es error de token expirado, reconectar con token nuevo
        if (err.message.includes("JWT") || err.message.includes("expired")) {
          console.log("🔄 Token expirado, obteniendo uno nuevo...");
          socket.disconnect();
          setTimeout(() => connectSocket(), 2000);
        }
      });

      // Escuchar nuevo mensaje
      socket.on("new_message", (msg: any) => {
        console.log("📩 Nuevo mensaje recibido:", msg);
        
        // El backend envía el mensaje con chatId
        const messageWithChatId = {
          ...msg,
          chatId: msg.chatId || msg.chat_id
        };
        
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === messageWithChatId.chatId
              ? { 
                  ...chat, 
                  messages: [...chat.messages, messageWithChatId],
                  unreadCount: selectedChat?.id === chat.id ? 0 : (chat.unreadCount || 0) + 1
                }
              : chat
          )
        );
        
        // Solo hacer scroll si el mensaje es del chat actual
        if (selectedChat?.id === messageWithChatId.chatId) {
          scrollToBottom();
        }
      });

      // Escuchar usuarios conectados/desconectados
      socket.on("user_connected", ({ userId }: { userId: string }) => {
        setOnlineUsers((prev) => new Set(prev).add(userId));
      });

      socket.on("user_disconnected", ({ userId }: { userId: string }) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });

      socketRef.current = socket;

      // 🔄 Renovar token cada 30 minutos para evitar expiración
      const tokenRefreshInterval = setInterval(async () => {
        console.log("🔄 Renovando token del WebSocket...");
        const freshToken = await getToken({ skipCache: true });
        if (freshToken && socket.connected) {
          // Reconectar con el nuevo token
          socket.disconnect();
          socket.auth = { token: freshToken };
          socket.connect();
        }
      }, 30 * 60 * 1000); // 30 minutos

      return () => {
        clearInterval(tokenRefreshInterval);
      };
    };

    connectSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isLoaded, selectedChat?.id, getToken]);

  // Cargar chats
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
        
        // Asegurarse de que cada chat tenga la estructura correcta
        const chatsData = (res.data.chats || []).map((chat: any) => ({
          id: chat.id,
          participants: chat.participants || [],
          messages: chat.messages || [],
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
          unreadCount: chat.unreadCount || 0
        }));
        
        setChats(chatsData);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("🚨 Error al cargar chats:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error al cargar chats",
          text: error.response?.data?.message || "No se pudieron cargar los chats",
        });
      }
    };

    fetchChats();
  }, [isLoaded, getToken]);

  // Cargar usuarios
  useEffect(() => {
    if (!isLoaded) return;

    const fetchUsers = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No se pudo obtener token de Clerk");
        if (!BACKEND) throw new Error("BACKEND_URL no configurada");

        const res = await axios.get(
          `${BACKEND}/chat/users/search?q=&page=1&limit=50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Usuarios obtenidos:", res.data);
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("🚨 Error al cargar usuarios:", err);
      }
    };

    fetchUsers();
  }, [isLoaded, getToken]);

  // Enviar mensaje
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

  // Crear nuevo chat
  const handleCreateChat = async () => {
    if (!selectedUserId.trim()) {
      Swal.fire("Error", "Debes seleccionar un usuario", "warning");
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error("No se pudo obtener token de Clerk");
      if (!BACKEND) throw new Error("BACKEND_URL no configurada");

      const res = await axios.post(
        `${BACKEND}/chat/direct/${selectedUserId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Chat creado:", res.data);

      // Asegurarse de que el chat tenga la estructura correcta
      const newChat = {
        id: res.data.id,
        participants: res.data.participants || [],
        messages: res.data.messages || [],
        createdAt: res.data.createdAt,
        updatedAt: res.data.updatedAt,
        unreadCount: 0
      };

      setChats((prev) => [...prev, newChat]);
      setSelectedUserId("");

      if (socketRef.current) {
        socketRef.current.emit("join_chat", { chatId: newChat.id });
        console.log(`🔗 Uniéndose al chat recién creado ${newChat.id}`);
      }

      // Seleccionar automáticamente el nuevo chat
      setSelectedChat(newChat);

      Swal.fire("Chat creado", "Ya podés empezar a chatear", "success");
    } catch (err: any) {
      console.error("Error al crear chat:", err);
      const errorMsg = err.response?.data?.message || err.message || "No se pudo crear el chat";
      Swal.fire("Error", errorMsg, "error");
    }
  };

  // Seleccionar chat
  const handleSelectChat = (chat: Chat) => {
    if (selectedChat && socketRef.current) {
      socketRef.current.emit("leave_chat", { chatId: selectedChat.id });
      console.log(`🚪 Saliendo del chat ${selectedChat.id}`);
    }

    setSelectedChat(chat);

    // Marcar como leído
    setChats((prev) =>
      prev.map((c) =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      )
    );

    if (socketRef.current) {
      socketRef.current.emit("join_chat", { chatId: chat.id });
      socketRef.current.emit("mark_as_read", { chatId: chat.id });
      console.log(`🔗 Uniéndose al chat ${chat.id}`);
    }
  };

  // Obtener último mensaje de un chat
  const getLastMessage = (chat: Chat) => {
    if (!chat.messages || chat.messages.length === 0) return "Sin mensajes";
    
    const lastMsg = chat.messages[chat.messages.length - 1];
    if (!lastMsg || !lastMsg.content) return "Sin mensajes";
    
    return lastMsg.content.length > 40
      ? lastMsg.content.substring(0, 40) + "..."
      : lastMsg.content;
  };

  // Formatear hora del último mensaje
  const formatLastMessageTime = (chat: Chat) => {
    if (!chat.messages || chat.messages.length === 0) return "";
    
    const lastMsg = chat.messages[chat.messages.length - 1];
    if (!lastMsg || !lastMsg.created_at) return "";
    
    const date = new Date(lastMsg.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    }
  };

  // Filtrar chats por búsqueda
  const filteredChats = chats.filter((chat) => {
    if (!chat.participants || chat.participants.length === 0) return false;
    
    const otherUser = chat.participants.find((p) => p.id !== user?.id);
    if (!otherUser) return false;
    
    const name = `${otherUser?.first_name || ""} ${otherUser?.last_name || ""}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  // Eliminar mensaje (actualizado para enviar chatId)
  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedChat || !socketRef.current) return;

    const result = await Swal.fire({
      title: '¿Eliminar mensaje?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      socketRef.current.emit('delete_message', { 
        messageId, 
        chatId: selectedChat.id 
      });
    }
  };

  useEffect(scrollToBottom, [selectedChat]);

  return (
    <div className="flex h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      {/* ==================== SIDEBAR: LISTA DE CHATS ==================== */}
      <aside className="w-[380px] border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Mensajería</h1>
            <button
              onClick={() => {
                Swal.fire({
                  title: "Nuevo Mensaje",
                  html: `
                    <select id="swal-select" class="swal2-input">
                      <option value="">Seleccioná un usuario...</option>
                      ${users.map(u => `<option value="${u.id}">${u.first_name} ${u.last_name}</option>`).join("")}
                    </select>
                  `,
                  showCancelButton: true,
                  confirmButtonText: "Crear Chat",
                  cancelButtonText: "Cancelar",
                  preConfirm: () => {
                    const select = document.getElementById("swal-select") as HTMLSelectElement;
                    return select?.value;
                  },
                }).then((result) => {
                  if (result.isConfirmed && result.value) {
                    setSelectedUserId(result.value);
                    setTimeout(() => handleCreateChat(), 100);
                  }
                });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              + Nuevo Mensaje
            </button>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Lista de chats */}
        <ul className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-sm">No hay conversaciones</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const otherUser = chat.participants?.find((p) => p.id !== user?.id);
              const isOnline = otherUser ? onlineUsers.has(otherUser.id) : false;
              const isSelected = selectedChat?.id === chat.id;

              return (
                <li
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`px-4 py-3 cursor-pointer transition-all border-b border-gray-100 hover:bg-gray-50 ${
                    isSelected ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar con estado online */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                        {(otherUser?.first_name?.[0] || "?").toUpperCase()}
                      </div>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Info del chat */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {otherUser?.first_name || "Usuario"} {otherUser?.last_name || ""}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatLastMessageTime(chat)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {getLastMessage(chat)}
                        </p>
                        {chat.unreadCount && chat.unreadCount > 0 && (
                          <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 font-semibold flex-shrink-0">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      {isOnline && (
                        <p className="text-xs text-green-600 mt-1">En línea</p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </aside>

      {/* ==================== VENTANA DE CHAT ==================== */}
      <main className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            {/* Header del chat */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const otherUser = selectedChat.participants.find((p) => p.id !== user?.id);
                  const isOnline = otherUser ? onlineUsers.has(otherUser.id) : false;
                  return (
                    <>
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {(otherUser?.first_name?.[0] || "?").toUpperCase()}
                        </div>
                        {isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-800">
                          {otherUser?.first_name || "Usuario"} {otherUser?.last_name || ""}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {isOnline ? "En línea" : "Desconectado"}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!selectedChat.messages || selectedChat.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p className="text-sm">No hay mensajes todavía. ¡Escribí el primero!</p>
                </div>
              ) : (
                selectedChat.messages.map((msg, index) => {
                  const isMyMessage = msg.senderId === user?.id;
                  const showAvatar =
                    index === 0 ||
                    selectedChat.messages[index - 1]?.senderId !== msg.senderId;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[70%] ${
                          isMyMessage ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar (solo si es necesario) */}
                        {!isMyMessage && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {(selectedChat.participants.find((p) => p.id === msg.senderId)?.first_name?.[0] || "?").toUpperCase()}
                          </div>
                        )}
                        {!isMyMessage && !showAvatar && <div className="w-8" />}

                        {/* Mensaje */}
                        <div
                          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                            isMyMessage
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <span
                            className={`block text-[10px] mt-1 ${
                              isMyMessage ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString("es-AR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip size={20} className="text-gray-600" />
                </button>
                <input
                  type="text"
                  placeholder="Escribí un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  disabled={!newMessage.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Send size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Seleccioná una conversación
            </h3>
            <p className="text-sm text-gray-500">
              Elegí un chat de la lista o creá uno nuevo
            </p>
          </div>
        )}
      </main>
    </div>
  );
}