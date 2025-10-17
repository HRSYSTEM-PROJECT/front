
// "use client"


// export const fetchConversations = async (token: string) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat?page=1&limit=20`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(`Error al obtener los chats: ${res.status} - ${text}`);
//     }

//     const data = await res.json();
//     return data.chats || [];
//   } catch (error) {
//     console.error("❌ Error en fetchConversations:", error);
//     throw error;
//   }
// };

// export async function fetchConversations(token?: string) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Error al obtener los chats: ${res.status} - ${text}`);
//   }

//   const data = await res.json();
//   // Aseguramos que siempre sea array
//   return Array.isArray(data) ? data : [];
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