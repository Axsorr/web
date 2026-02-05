import { useEffect, useMemo, useState } from "react";
import ChatList from "../components/ChatList";
import IndividualChat from "./IndividualChat";
import { fetchChats, getCurrentUserId, markChatAsRead, subscribeToChatEvents, type ChatMessage, type ChatSummary } from "../api/chat";

export default function ChatPage() {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [incomingMessage, setIncomingMessage] = useState<ChatMessage | undefined>();
  const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});
  const [me, setMe] = useState(getCurrentUserId());

  useEffect(() => {
    fetchChats().then((result) => {
      setChats(result);
      if (!selectedChatId && result.length > 0) setSelectedChatId(result[0].id);
    });

    const unsubscribe = subscribeToChatEvents((event) => {
      if (event.type === "message:new") {
        setIncomingMessage(event.payload);

        setChats((prev) => {
          const found = prev.find((chat) => chat.id === event.chatId);
          if (!found) return prev;

          const updated = prev.map((chat) => {
            if (chat.id !== event.chatId) return chat;
            const shouldIncreaseUnread = selectedChatId !== chat.id && event.payload.senderId !== me;
            return {
              ...chat,
              unreadCount: shouldIncreaseUnread ? chat.unreadCount + 1 : chat.unreadCount,
              lastMessage: {
                id: event.payload.id,
                content: event.payload.content,
                createdAt: event.payload.createdAt,
              },
            };
          });

          return updated.sort((a, b) => {
            const t1 = a.lastMessage ? Date.parse(a.lastMessage.createdAt) : 0;
            const t2 = b.lastMessage ? Date.parse(b.lastMessage.createdAt) : 0;
            return t2 - t1;
          });
        });
      }

      if (event.type === "chat:read") {
        setChats((prev) => prev.map((chat) => (chat.id === event.chatId ? { ...chat, unreadCount: 0 } : chat)));
      }

      if (event.type === "typing") {
        setTypingMap((prev) => ({ ...prev, [event.chatId]: event.isTyping }));
      }

      if (event.type === "presence") {
        setChats((prev) =>
          prev.map((chat) => (chat.partnerId === event.userId ? { ...chat, partnerPresence: event.status } : chat)),
        );
      }
    });

    return () => unsubscribe();
  }, [selectedChatId, me]);

  const selectedChat = useMemo(() => chats.find((chat) => chat.id === selectedChatId) ?? null, [chats, selectedChatId]);

  const onSelectChat = async (chatId: string) => {
    setSelectedChatId(chatId);
    setTypingMap((prev) => ({ ...prev, [chatId]: false }));
    setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)));
    await markChatAsRead(chatId);
  };

  const switchUser = (id: string) => {
    localStorage.setItem("demoUserId", id);
    setMe(id);
    setSelectedChatId(null);
  };

  return (
    <div style={layout}>
      <aside style={{ width: "min(340px, 45%)", minWidth: 240 }}>
        <div style={switcher}>
          <small>Demo user:</small>
          <button onClick={() => switchUser("u1")} style={me === "u1" ? activeBtn : switchBtn}>Axsor</button>
          <button onClick={() => switchUser("u2")} style={me === "u2" ? activeBtn : switchBtn}>Tazo</button>
        </div>
        <ChatList chats={chats} selectedChatId={selectedChatId} onSelect={onSelectChat} />
      </aside>

      <main style={{ flex: 1 }}>
        {selectedChat ? (
          <IndividualChat
            chatId={selectedChat.id}
            partnerName={selectedChat.partnerName}
            partnerPresence={selectedChat.partnerPresence}
            incomingMessage={incomingMessage}
            typingByPartner={typingMap[selectedChat.id] ?? false}
          />
        ) : (
          <div style={{ padding: 24 }}>Pick a chat from the list.</div>
        )}
      </main>
    </div>
  );
}

const layout: React.CSSProperties = {
  display: "flex",
  height: "100svh",
  background: "#fff",
};

const switcher: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: 12,
  borderBottom: "1px solid #ddd",
};

const switchBtn: React.CSSProperties = {
  border: "1px solid #ccc",
  background: "#fff",
  borderRadius: 999,
  padding: "4px 10px",
};

const activeBtn: React.CSSProperties = {
  ...switchBtn,
  border: "1px solid #4338ca",
  background: "#eef2ff",
};
