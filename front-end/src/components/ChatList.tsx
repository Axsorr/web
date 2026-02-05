import { useEffect, useState } from "react";
import { fetchChats, markChatAsRead } from "../api/chat";

type ChatItem = {
  id: string;
  partnerName: string;
  lastMessage: { content: string };
  unreadCount: number;
};

export default function ChatList({ onSelect }: { onSelect: (chatId: string) => void }) {
  const [chats, setChats] = useState<ChatItem[]>([]);

  useEffect(() => {
    fetchChats().then(setChats);
  }, []);

  const handleClick = (chatId: string) => {
    markChatAsRead(chatId);
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
    onSelect(chatId); // <-- passes chatId
  };

  return (
    <div>
      <h2>Chats</h2>
      {chats.map(c => (
        <div
          key={c.id}
          style={{
            border: "1px solid gray",
            margin: 4,
            padding: 4,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between"
          }}
          onClick={() => handleClick(c.id)}
        >
          <span>{c.partnerName}: {c.lastMessage.content}</span>
          {c.unreadCount > 0 && <span style={{ color: "red" }}>● {c.unreadCount}</span>}
        </div>
      ))}
    </div>
  );
}
