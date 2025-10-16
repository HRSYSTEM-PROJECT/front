"use client";
import React, { useMemo } from "react";
import type { Message, Conversation } from "./types";

interface Props {
  conversation?: Conversation | null;
  messages: Message[];
  currentUserId?: string;
}

export default function ChatWindow({ conversation, messages, currentUserId = "me" }: Props) {
  const title = conversation?.title || "Selecciona una conversación";

  const grouped = useMemo(() => {
    // simple: return messages sorted asc
    return [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-[70vh] bg-white rounded-lg shadow">
      <header className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <div className="text-xs text-gray-500">En línea</div>
        </div>
        <div className="text-sm text-gray-500">⋯</div>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {!conversation ? (
          <div className="text-gray-500">Selecciona una conversación a la izquierda</div>
        ) : (
          grouped.map((m) => {
            const isMe = m.senderId === currentUserId || m.senderId === "me";
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${isMe ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-800"}`}>
                  <div className="text-sm">{m.text}</div>
                  <div className={`text-xs mt-2 ${isMe ? "text-blue-100" : "text-gray-500"}`}>{new Date(m.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}