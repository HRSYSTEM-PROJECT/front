
// "use client";

// import { useState, useEffect } from "react";
// import { useUser, useAuth } from "@clerk/nextjs";
// import axios from "axios";
// import { Send, Plus, Phone, Video, MoreVertical, Search } from "lucide-react";

// interface Contact {
//   id: number;
//   name: string;
//   position: string;
//   lastMessage: string;
//   time: string;
//   unread?: number;
//   online?: boolean;
// }

// interface Message {
//   id: number;
//   sender: string;
//   text: string;
//   timestamp: string;
// }

// export default function MensajeriaPage() {
//   const { user } = useUser();
//   const { getToken } = useAuth();

//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [selected, setSelected] = useState<Contact | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   // 🚀 Cuando tengas el backend, podrás usar esto
//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const token = await getToken({ template: "integration_fallback" });
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/chats`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setContacts(response.data);
//       } catch (error) {
//         console.error("Error al obtener los chats:", error);
//         // fallback temporal de prueba
//         setContacts([
//           { id: 1, name: "Juan Pérez", position: "Gerente de Ventas", lastMessage: "Nos vemos mañana", time: "10:30", unread: 2, online: true },
//           { id: 2, name: "Ana Martínez", position: "Diseñadora UX", lastMessage: "Te envié los mockups", time: "09:15", online: true },
//         ]);
//       }
//     };
//     fetchContacts();
//   }, []);

//   // Cargar mensajes del chat seleccionado
//   useEffect(() => {
//     if (!selected) return;

//     const fetchMessages = async () => {
//       try {
//         const token = await getToken({ template: "integration_fallback" });
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/mensajes/${selected.id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setMessages(response.data);
//       } catch (error) {
//         console.error("Error al obtener mensajes:", error);
//         // fallback de ejemplo local
//         setMessages([
//           { id: 1, sender: selected.name, text: "Hola, ¿cómo va todo?", timestamp: "10:15" },
//           { id: 2, sender: user?.firstName || "Tú", text: "Todo bien, gracias!", timestamp: "10:18" },
//         ]);
//       }
//     };
//     fetchMessages();
//   }, [selected]);

//   // Enviar mensaje
//   const handleSend = async () => {
//     if (!newMessage.trim() || !selected) return;

//     const msg: Message = {
//       id: Date.now(),
//       sender: user?.firstName || "Tú",
//       text: newMessage,
//       timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     };

//     setMessages((prev) => [...prev, msg]);
//     setNewMessage("");

//     //  Cuando el backend esté listo, se envía así:
//     try {
//       const token = await getToken({ template: "integration_fallback" });
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/mensajes`,
//         {
//           chatId: selected.id,
//           content: newMessage,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     } catch (error) {
//       console.error("Error al enviar mensaje:", error);
//     }
//   };

//   return (
//     <div className="flex h-[80vh] bg-white shadow rounded-2xl overflow-hidden">
//       {/* Lista de conversaciones */}
//       <aside className="w-1/3 border-r flex flex-col">
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-xl font-semibold text-gray-700">Mensajería</h2>
//           <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700">
//             <Plus size={16} /> Nuevo
//           </button>
//         </div>

//         <div className="p-3 border-b">
//           <div className="flex items-center bg-gray-100 rounded-lg px-2">
//             <Search size={18} className="text-gray-500" />
//             <input
//               type="text"
//               placeholder="Buscar conversaciones..."
//               className="flex-1 bg-transparent p-2 text-sm focus:outline-none"
//             />
//           </div>
//         </div>

//         <div className="overflow-y-auto">
//           {contacts.map((contact) => (
//             <div
//               key={contact.id}
//               onClick={() => setSelected(contact)}
//               className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
//                 selected?.id === contact.id ? "bg-gray-100" : ""
//               }`}
//             >
//               <div className="relative w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
//                 {contact.name
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")
//                   .slice(0, 2)
//                   .toUpperCase()}
//                 {contact.online && (
//                   <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <p className="font-medium text-gray-800">{contact.name}</p>
//                 <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
//               </div>
//               <div className="text-xs text-gray-400 text-right">
//                 <p>{contact.time}</p>
//                 {contact.unread && (
//                   <span className="bg-blue-600 text-white rounded-full px-2 py-[2px] text-[10px]">
//                     {contact.unread}
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </aside>

//       {/* Chat principal */}
//       <main className="flex-1 flex flex-col">
//         {selected ? (
//           <>
//             <div className="flex items-center justify-between p-4 border-b">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
//                   {selected.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")
//                     .slice(0, 2)
//                     .toUpperCase()}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-800">{selected.name}</p>
//                   <p className="text-xs text-green-600">En línea</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 text-gray-500">
//                 <Phone className="cursor-pointer hover:text-blue-600" size={18} />
//                 <Video className="cursor-pointer hover:text-blue-600" size={18} />
//                 <MoreVertical className="cursor-pointer hover:text-blue-600" size={18} />
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${
//                     msg.sender === user?.firstName ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-sm px-3 py-2 rounded-2xl ${
//                       msg.sender === user?.firstName
//                         ? "bg-blue-600 text-white rounded-br-none"
//                         : "bg-gray-200 text-gray-800 rounded-bl-none"
//                     }`}
//                   >
//                     <p className="text-sm">{msg.text}</p>
//                     <span className="text-[10px] text-gray-300 block text-right">
//                       {msg.timestamp}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="p-3 border-t flex items-center bg-white">
//               <input
//                 type="text"
//                 placeholder="Escribe un mensaje..."
//                 className="flex-1 border rounded-lg p-2 text-sm focus:outline-none"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               />
//               <button
//                 onClick={handleSend}
//                 className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
//               >
//                 <Send size={16} /> Enviar
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="flex flex-1 items-center justify-center text-gray-400">
//             Selecciona una conversación
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import type { Conversation, Message } from "./components/types";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  createConversation,
  deleteConversation,
} from "./services/chatService";
import Swal from "sweetalert2";

export default function MensajeriaPage() {
  const { getToken, userId, isLoaded } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [Loading, setLoading] = useState(true);

  // cargar conversaciones
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const tokenRaw = isLoaded ? (await getToken()) ?? undefined : undefined;
      const token = tokenRaw ?? undefined;
      const conv = await fetchConversations(token);
      setConversations(conv);
      if (conv.length > 0) setSelectedConversation(conv[0]);
      setLoading(false);
    };
    load();
  }, [isLoaded, getToken]);

  // cargar mensajes cuando cambia la conversación
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }
    const load = async () => {
      const token = isLoaded ? (await getToken()) ?? undefined : undefined;
      if (selectedConversation?.id && selectedConversation.id !== null) {
        const msgs = await fetchMessages(selectedConversation.id as string, token);
        setMessages(msgs);
      }
    };
    load();
  }, [selectedConversation, isLoaded, getToken]);

  const handleSelect = (c: Conversation) => {
    setSelectedConversation(c);
  };

  const handleSend = async (text: string) => {
    if (!selectedConversation) {
      Swal.fire("Selecciona una conversación para enviar un mensaje.");
      return;
    }
    const token = isLoaded ? (await getToken()) ?? undefined : undefined;
    if (!selectedConversation.id) {
      Swal.fire("La conversación seleccionada no es válida.");
      return;
    }
    const sent = await sendMessage(selectedConversation.id as string, text, token);
    setMessages((prev) => [...prev, sent]);
    // actualizar última en la lista
    setConversations((prev) =>
      prev.map((p) => (p.id === selectedConversation.id ? { ...p, lastMessage: text, updatedAt: new Date().toISOString() } : p))
    );
  };

  const handleCreate = async () => {
    const { value: title } = await Swal.fire({
      title: "Nueva conversación",
      input: "text",
      inputPlaceholder: "Nombre o asunto",
      showCancelButton: true,
    });
    if (!title) return;
    const token = isLoaded ? (await getToken()) ?? undefined : undefined;
    const conv = await createConversation(title, token);
    setConversations((prev) => [conv, ...prev]);
    setSelectedConversation(conv);
  };

  const handleDelete = async (id: string) => {
    const token = isLoaded ? (await getToken()) ?? undefined : undefined;
    const ok = await deleteConversation(id, token);
    if (ok) {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (selectedConversation?.id === id) setSelectedConversation(null);
      Swal.fire("Eliminado", "Conversación eliminada", "success");
    } else {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Mensajería</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ChatList
            conversations={conversations}
            selectedId={selectedConversation?.id}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
          <div className="mt-4">
            <button onClick={handleCreate} className="w-full bg-blue-700 text-white py-2 rounded">
              + Nueva conversación
            </button>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col">
          <ChatWindow conversation={selectedConversation} messages={messages} currentUserId={userId || "me"} />
          <MessageInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}