import { useEffect, useMemo, useRef, useState } from "react";
import { fetchMessages, getCurrentUserId, markChatAsRead, sendMessage, sendTyping, type ChatMessage } from "../api/chat";

type Props = {
  chatId: string;
  partnerName: string;
  partnerPresence: "online" | "offline";
  incomingMessage?: ChatMessage;
  typingByPartner: boolean;
};

export default function IndividualChat({
  chatId,
  partnerName,
  partnerPresence,
  incomingMessage,
  typingByPartner,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const typingTimeout = useRef<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([]);
    setNextCursor(null);

    fetchMessages(chatId).then((data) => {
      setMessages(data.messages);
      setNextCursor(data.nextCursor);
      markChatAsRead(chatId);
    });
  }, [chatId]);

  useEffect(() => {
    if (!incomingMessage || incomingMessage.chatId !== chatId) return;
    setMessages((prev) => (prev.some((m) => m.id === incomingMessage.id) ? prev : [...prev, incomingMessage]));
  }, [incomingMessage, chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typingByPartner]);

  const formattedMessages = useMemo(
    () => messages.map((msg) => ({ ...msg, mine: msg.senderId === getCurrentUserId() })),
    [messages],
  );

  const send = async () => {
    if (!input.trim()) return;
    const sent = await sendMessage(chatId, input);
    setMessages((prev) => [...prev, sent]);
    setInput("");
    sendTyping(chatId, false);
  };

  const onType = (value: string) => {
    setInput(value);
    sendTyping(chatId, value.trim().length > 0);

    if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
    typingTimeout.current = window.setTimeout(() => {
      sendTyping(chatId, false);
    }, 1200);
  };

  const loadOlder = async () => {
    if (!nextCursor) return;
    const data = await fetchMessages(chatId, nextCursor);
    setMessages((prev) => [...data.messages, ...prev]);
    setNextCursor(data.nextCursor);
  };

  return (
    <div style={wrap}>
      <header style={header}>
        <h3 style={{ margin: 0 }}>{partnerName}</h3>
        <small style={{ color: partnerPresence === "online" ? "green" : "#777" }}>
          {partnerPresence === "online" ? "● online" : "○ offline"}
        </small>
      </header>

      <div style={messagesWrap}>
        {nextCursor && (
          <button onClick={loadOlder} style={olderBtn}>
            Load older messages
          </button>
        )}

        {formattedMessages.map((m) => (
          <div key={m.id} style={{ ...bubble, marginLeft: m.mine ? "auto" : 0, background: m.mine ? "#dbeafe" : "#f3f4f6" }}>
            <div>{m.content}</div>
            <small style={{ color: "#666" }}>{new Date(m.createdAt).toLocaleString()}</small>
          </div>
        ))}

        {typingByPartner && <div style={{ ...bubble, background: "#fef3c7" }}>💬 typing...</div>}
        <div ref={endRef} />
      </div>

      <div style={composer}>
        <input
          style={inputStyle}
          value={input}
          onChange={(e) => onType(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Type a message..."
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = { display: "flex", flexDirection: "column", height: "100%" };
const header: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid #ddd",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const messagesWrap: React.CSSProperties = { flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 };
const bubble: React.CSSProperties = { maxWidth: "70%", borderRadius: 10, padding: "8px 10px", border: "1px solid #d1d5db" };
const composer: React.CSSProperties = { display: "flex", gap: 8, padding: 12, borderTop: "1px solid #ddd" };
const inputStyle: React.CSSProperties = { flex: 1, padding: "10px 12px" };
const olderBtn: React.CSSProperties = { alignSelf: "center" };
