// "use client";

// import { useState, useEffect } from "react";
// import { useUser, useAuth } from "@clerk/nextjs";
// import axios from "axios";
// import { Send, Plus, Phone, Video, MoreVertical, Search } from "lucide-react";

// interface Contact {
//   id: string; // ahora usamos string para id, que es lo que tu backend devuelve
//   name: string;
//   lastMessage?: string;
//   time?: string;
//   unread?: number;
//   online?: boolean;
// }

// interface Message {
//   id: string;
//   sender_id: string;
//   sender_name: string;
//   content: string;
//   created_at: string;
//   is_deleted?: boolean;
//   is_edited?: boolean;
// }

// export default function MensajeriaPage() {
//   const { user } = useUser();
//   const { getToken } = useAuth();

//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [selected, setSelected] = useState<Contact | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;



//   const fetchChats = async () => {
//     try {
//       const token = await getToken();
//       const res = await axios.get(`${API_URL}/chat`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // Mapear para tu modelo de Contact
//       const chats: Contact[] = res.data.map((c: any) => {
//         const other = c.participants.find((p: any) => p.user.id !== user?.id);
//         return {
//           id: c.id,
//           name: other ? other.user.full_name : c.name || "Chat",
//           lastMessage: c.last_message?.content || "",
//           time: c.last_message ? new Date(c.last_message.created_at).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}) : "",
//           unread: c.unread_count || 0,
//           online: true,
//         };
//       });
//       setContacts(chats);
//     } catch (error) {
//       console.error("Error fetching chats:", error);
//       setContacts([]);
//     }
//   };

//   // Obtener mensajes de un chat específico
//   const fetchMessages = async (chatId: string) => {
//     try {
//       const token = await getToken();
//       const res = await axios.get(`${API_URL}/chat/${chatId}/messages`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const msgs: Message[] = res.data.map((m: any) => ({
//         id: m.id,
//         sender_id: m.sender_id,
//         sender_name: m.sender.first_name,
//         content: m.content,
//         created_at: m.created_at,
//         is_deleted: m.is_deleted,
//         is_edited: m.is_edited,
//       }));
//       setMessages(msgs);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       setMessages([]);
//     }
//   };

//   // Enviar mensaje
//   const sendMessage = async () => {
//     if (!selected || !newMessage.trim()) return;

//     try {
//       const token = await getToken();
//       const res = await axios.post(
//         `${API_URL}/chat/${selected.id}/messages`,
//         { content: newMessage },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // agregar al estado local
//       setMessages((prev) => [...prev, {
//         id: res.data.id,
//         sender_id: res.data.sender_id,
//         sender_name: user?.firstName || "Tú",
//         content: res.data.content,
//         created_at: res.data.created_at,
//       }]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   // Crear chat directo con otro usuario
//   // const createDirectChat = async (otherUserId: string) => {
//   //   try {
//   //     const token = await getToken();
//   //     const res = await axios.post(`${API_URL}/chat/direct/${otherUserId}`, {}, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });
//   //     // recargar lista de chats
//   //     fetchChats();
//   //     setSelected({ id: res.data.id, name: res.data.name || "Chat" });
//   //     setMessages([]);
//   //   } catch (error) {
//   //     console.error("Error creating direct chat:", error);
//   //   }
//   // };

//   const handleCreateChat = async (otherUserId: string) => {
//   try {
//     const token = await getToken();
//     const res = await axios.post(
//       `${API_URL}/chat/direct/${otherUserId}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     // Aquí puedes agregar el chat recién creado a tu lista de contacts
//     setContacts(prev => [...prev, {
//       id: res.data.id,
//       name: res.data.creator.first_name + ' ' + res.data.creator.last_name,
//       position: '',
//       lastMessage: '',
//       time: '',
//     }]);
//   } catch (err) {
//     console.error("Error creando chat:", err);
//   }
// };


//   useEffect(() => {
//     fetchChats();
//   }, []);

//   useEffect(() => {
//     if (selected) fetchMessages(selected.id);
//   }, [selected]);


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
//                     msg.sender_id === user?.id ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-sm px-3 py-2 rounded-2xl ${
//                       msg.sender_id === user?.id
//                         ? "bg-blue-600 text-white rounded-br-none"
//                         : "bg-gray-200 text-gray-800 rounded-bl-none"
//                     }`}
//                   >
//                     <p className="text-sm">{msg.content}</p>
//                     <span className="text-[10px] text-gray-300 block text-right">
//                       {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
//                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               />
//               <button
//                 onClick={sendMessage}
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

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Send, Plus, Search } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface UserType {
  id: string;
  first_name: string;
  full_name: string;
}

interface Contact {
  id: string;
  name: string;
  unread?: number;
}

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

interface ChatResponse {
  id: string;
  participants: { user: UserType }[];
  unread_count: number;
}

interface MessageResponse {
  id: string;
  sender: UserType;
  content: string;
  created_at: string;
}

export default function MensajeriaPage() {
  const { user } = useUser();
  const { getToken, isLoaded } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       const token = await getToken();
  //       const res = await axios.get<ChatResponse[]>(`${API_URL}/chat`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       const chats: Contact[] = res.data.map((chat) => {
  //         const otherParticipant = chat.participants.find(
  //           (p) => p.user.id !== user?.id
  //         );
  //         return {
  //           id: chat.id,
  //           name: otherParticipant?.user.full_name || "Chat",
  //           unread: chat.unread_count,
  //         };
  //       });

  //       setContacts(chats);
  //     } catch (err) {
  //       const error = err as AxiosError;
  //       console.error("Error al obtener chats:", error.message);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error al cargar chats",
  //         text: error.message,
  //       });
  //     }
  //   };

  //   fetchChats();
  // }, [getToken, user?.id]);

  // useEffect(() => {
  //   if (!selectedChatId) return;

  //   const fetchMessages = async () => {
  //     try {
  //       const token = await getToken();
  //       const res = await axios.get<MessageResponse[]>(
  //         `${API_URL}/chat/${selectedChatId}/messages?page=1&limit=50`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       const msgs: Message[] = res.data.map((m) => ({
  //         id: m.id,
  //         sender_id: m.sender.id,
  //         sender_name: m.sender.first_name,
  //         content: m.content,
  //         created_at: m.created_at,
  //       }));

  //       setMessages(msgs);
  //     } catch (err) {
  //       const error = err as AxiosError;
  //       console.error("Error al cargar mensajes:", error.message);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error al cargar mensajes",
  //         text: error.message,
  //       });
  //     }
  //   };

  //   fetchMessages();
  // }, [selectedChatId, getToken]);


useEffect(() => {
  if (!isLoaded) return; // Esperar a que Clerk cargue

  const fetchChats = async () => {
    try {
      const token = await getToken();
      

      if (!token) {
        console.error("No se obtuvo el token de Clerk");
        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: "No se pudo obtener el token de sesión. Intenta recargar la página.",
        });
        return;
      }

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setContacts(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "Tu cuenta no tiene permisos para acceder al chat.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al cargar chats",
            text: err.response?.data?.message || "No se pudieron cargar los chats.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error desconocido",
          text: "Algo salió mal al intentar obtener los chats.",
        });
      }
    }
  };

  fetchChats();
}, [isLoaded])

  // 🔹 Enviar mensaje
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedChatId) return;

    try {
      const token = await getToken();
      const res = await axios.post<MessageResponse>(
        `${API_URL}/chat/${selectedChatId}/messages`,
        { content: newMessage, type: "text" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMsg: Message = {
        id: res.data.id,
        sender_id: res.data.sender.id,
        sender_name: res.data.sender.first_name,
        content: res.data.content,
        created_at: res.data.created_at,
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error al enviar mensaje:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error al enviar mensaje",
        text: error.message,
      });
    }
  };

  // 🔹 Crear chat directo con otro usuario
  const handleCreateDirectChat = async (otherUserId: string) => {
    try {
      const token = await getToken();
      const res = await axios.post<ChatResponse>(
        `${API_URL}/chat/direct/${otherUserId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const otherParticipant = res.data.participants.find(
        (p) => p.user.id !== user?.id
      );

      const newChat: Contact = {
        id: res.data.id,
        name: otherParticipant?.user.full_name || "Chat",
        unread: 0,
      };

      setContacts((prev) => [...prev, newChat]);
      Swal.fire({
        icon: "success",
        title: "Chat creado",
        text: `Se creó un chat con ${newChat.name}`,
      });
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error al crear chat directo:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error al crear chat",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex h-[80vh] bg-white shadow rounded-2xl overflow-hidden">
      {/* Lista de chats */}
      <aside className="w-1/3 border-r flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Mensajería</h2>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700"
            onClick={() => handleCreateDirectChat("uuid_otro_usuario")} // Reemplazar por ID real
          >
            <Plus size={16} /> Nuevo
          </button>
        </div>

        <div className="p-3 border-b">
          <div className="flex items-center bg-gray-100 rounded-lg px-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              className="flex-1 bg-transparent p-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {Array.isArray(contacts) &&
          contacts.map((contact) => (
            <div   
              key={contact.id}
              onClick={() => setSelectedChatId(contact.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
                selectedChatId === contact.id ? "bg-gray-100" : ""
              }`}
            
            >
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold">
                {contact.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium">{contact.name}</p>
                {contact.unread && (
                  <p className="text-xs text-gray-500 truncate">
                    {contact.unread} mensajes
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <main className="flex-1 flex flex-col">
        {selectedChatId ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-sm px-3 py-2 rounded-2xl ${
                      msg.sender_id === user?.id
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-[10px] block text-right">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t flex items-center bg-white">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-1 border rounded-lg p-2 text-sm focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
              >
                <Send size={16} /> Enviar
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Selecciona una conversación
          </div>
        )}
      </main>
    </div>
  );
}