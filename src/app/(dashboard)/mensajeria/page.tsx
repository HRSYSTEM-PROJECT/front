
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


const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://back-8cv1.onrender.com";

export async function fetchConversations(token: string) {
  const res = await fetch(`${API_URL}/chat?page=1&limit=20`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al obtener los chats: ${res.status} - ${text}`);
  }

  return res.json();
}

export async function fetchMessages(conversationId: string, token: string) {
  const res = await fetch(`${API_URL}/chat/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al obtener mensajes: ${res.status} - ${text}`);
  }

  return res.json();
}

export async function sendMessage(conversationId: string, text: string, token: string) {
  const res = await fetch(`${API_URL}/chat/${conversationId}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const textRes = await res.text();
    throw new Error(`Error al enviar mensaje: ${res.status} - ${textRes}`);
  }

  return res.json();
}

export async function createConversation(title: string, token: string) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al crear conversación: ${res.status} - ${text}`);
  }

  return res.json();
}

export async function deleteConversation(id: string, token: string) {
  const res = await fetch(`${API_URL}/chat/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al eliminar conversación: ${res.status} - ${text}`);
  }

  return true;
}