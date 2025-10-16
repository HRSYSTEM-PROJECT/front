export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  unreadCount?: number;
  participants?: { id: string; name: string }[];
  updatedAt?: string;
}