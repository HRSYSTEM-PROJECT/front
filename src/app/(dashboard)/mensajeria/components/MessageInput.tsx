"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (text: string) => Promise<void> | void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    await onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={submit} className="mt-3 px-4 py-3 border-t bg-white rounded-b-lg">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 border rounded px-4 py-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className={`px-4 py-2 rounded bg-blue-700 text-white disabled:opacity-60`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}