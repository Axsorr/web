const API_URL = "http://localhost:4000";

export type ChatSummary = {
  id: string;
  partnerId: string;
  partnerName: string;
  unreadCount: number;
  partnerPresence: "online" | "offline";
  lastMessage: { id: string; content: string; createdAt: string } | null;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export type ChatEvent =
  | { type: "message:new"; chatId: string; payload: ChatMessage }
  | { type: "chat:read"; chatId: string; userId: string }
  | { type: "typing"; chatId: string; userId: string; isTyping: boolean }
  | { type: "presence"; userId: string; status: "online" | "offline" };

const meId = () => localStorage.getItem("demoUserId") ?? "u1";

export function getCurrentUserId() {
  return meId();
}

export async function fetchChats() {
  const res = await fetch(`${API_URL}/chat/chats?userId=${meId()}`);
  if (!res.ok) throw new Error("Failed to fetch chats");
  const data = await res.json();
  return data.chats as ChatSummary[];
}

export async function ensureChatWithUser(otherUserId: string) {
  const res = await fetch(`${API_URL}/chat/with/${otherUserId}?userId=${meId()}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to create chat");
  const data = await res.json();
  return data.id as string;
}

export async function fetchMessages(chatId: string, before?: string) {
  const params = new URLSearchParams({ userId: meId(), limit: "30" });
  if (before) params.set("before", before);

  const res = await fetch(`${API_URL}/chat/chats/${chatId}/messages?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return (await res.json()) as { messages: ChatMessage[]; nextCursor: string | null };
}

export async function sendMessage(chatId: string, content: string) {
  const res = await fetch(`${API_URL}/chat/chats/${chatId}/messages?userId=${meId()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return (await res.json()) as ChatMessage;
}

export async function markChatAsRead(chatId: string) {
  await fetch(`${API_URL}/chat/chats/${chatId}/read?userId=${meId()}`, {
    method: "POST",
  });
}

export async function sendTyping(chatId: string, isTyping: boolean) {
  await fetch(`${API_URL}/chat/chats/${chatId}/typing?userId=${meId()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isTyping }),
  });
}

export function subscribeToChatEvents(onEvent: (event: ChatEvent) => void) {
  const source = new EventSource(`${API_URL}/chat/stream?userId=${meId()}`);

  source.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data) as ChatEvent;
      onEvent(parsed);
    } catch {
      // ignore malformed keepalive packets
    }
  };

  return () => source.close();
}
