"use client";
import React from "react";
import type { Conversation } from "./types";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";

interface Props {
  conversations: Conversation[];
  selectedId?: string | null;
  onSelect: (c: Conversation) => void;
  onDelete: (id: string) => void;
}

export default function ChatList({ conversations, selectedId, onSelect, onDelete }: Props) {
  return (
    <aside className="w-full md:w-96 bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Conversaciones</h3>
        <button
          onClick={async () => {
            const { value: title } = await Swal.fire({
              title: "Nueva conversación",
              input: "text",
              inputPlaceholder: "Nombre o asunto",
              showCancelButton: true,
            });
            if (title) {
              // parent will handle create
            }
          }}
          className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
        >
          + Nuevo
        </button>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-auto">
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            className={`cursor-pointer p-3 rounded-md flex items-start justify-between ${
              selectedId === c.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                  {c.title
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-sm">{c.title}</div>
                  <div className="text-xs text-gray-500">{c.lastMessage || "Sin mensajes aún"}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-400">{c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</div>
              <div className="mt-2 flex items-center gap-2">
                {c.unreadCount ? <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">{c.unreadCount}</span> : null}
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const res = await Swal.fire({
                      title: "Eliminar conversación?",
                      text: "Se eliminarán los mensajes de esta conversación.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Eliminar",
                    });
                    if (res.isConfirmed) onDelete(c.id);
                  }}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}