"use client";
import type { Conversation, Message } from "../components/types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL; // Ejemplo: https://back-8cv1.onrender.com

// 🔹 Obtener todos los chats del usuario
export async function fetchConversations(token?: string): Promise<Conversation[]> {
  const res = await fetch(`${API_URL}/chat`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener los chats");
  return res.json();
}

// 🔹 Obtener los mensajes de un chat
export async function fetchMessages(chatId: string, token?: string): Promise<Message[]> {
  const res = await fetch(`${API_URL}/chat/${chatId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener los mensajes");
  return res.json();
}

// 🔹 Enviar un mensaje
export async function sendMessage(chatId: string, text: string, token?: string): Promise<Message> {
  const res = await fetch(`${API_URL}/chat/${chatId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Error al enviar mensaje");
  return res.json();
}

// 🔹 Crear nueva conversación (chat directo)
export async function createConversation(otherUserId: string, token?: string): Promise<Conversation> {
  const res = await fetch(`${API_URL}/chat/direct/${otherUserId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al crear conversación");
  return res.json();
}

// 🔹 Editar mensaje
export async function editMessage(messageId: string, newText: string, token?: string): Promise<Message> {
  const res = await fetch(`${API_URL}/chat/messages/${messageId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: newText }),
  });
  if (!res.ok) throw new Error("Error al editar mensaje");
  return res.json();
}

// 🔹 Eliminar mensaje
export async function deleteMessage(messageId: string, token?: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/chat/messages/${messageId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

// 🔹 Eliminar conversación (si querés mantener esta acción)
export async function deleteConversation(chatId: string, token?: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/chat/${chatId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}