import type { ChatSummary } from "../api/chat";

type Props = {
  chats: ChatSummary[];
  selectedChatId: string | null;
  onSelect: (chatId: string) => void;
};

export default function ChatList({ chats, selectedChatId, onSelect }: Props) {
  return (
    <div style={listWrap}>
      <h2 style={{ marginTop: 0 }}>Chats</h2>
      {chats.length === 0 && <p>No chats yet.</p>}

      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat.id)}
          style={{
            ...item,
            background: selectedChatId === chat.id ? "#f1f3ff" : "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>{chat.partnerName}</strong>
            <span style={{ color: chat.partnerPresence === "online" ? "green" : "#777" }}>
              {chat.partnerPresence === "online" ? "● online" : "○ offline"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <small style={ellipsis}>{chat.lastMessage?.content ?? "No messages yet"}</small>
            {chat.unreadCount > 0 && <small style={badge}>{chat.unreadCount}</small>}
          </div>
        </button>
      ))}
    </div>
  );
}

const listWrap: React.CSSProperties = {
  borderRight: "1px solid #ddd",
  padding: 12,
  height: "100%",
  overflowY: "auto",
};

const item: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: "10px 12px",
  marginBottom: 10,
  cursor: "pointer",
};

const ellipsis: React.CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: 160,
  color: "#555",
};

const badge: React.CSSProperties = {
  borderRadius: 999,
  background: "#ef4444",
  color: "white",
  padding: "2px 8px",
  fontWeight: 700,
};
