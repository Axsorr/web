import { useEffect, useState } from "react";
import { fetchMessages, sendMessage, subscribeToChat } from "../api/chat";

export default function IndividualChat({ chatId, partnerName }: { chatId: string; partnerName: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await fetchMessages(chatId);
      setMessages(msgs);
    };
    loadMessages();

    // Real-time subscription (socket.io or web socket)
    const unsubscribe = subscribeToChat(chatId, (msg: any) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = await sendMessage(chatId, input);
    setMessages(prev => [...prev, msg]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h3 style={{ padding: 8 }}>Chat with {partnerName}</h3>

      <div style={{ flex: 1, overflowY: "auto", padding: 8, borderTop: "1px solid #ccc" }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#666" }}>
              {new Date(m.timestamp).toLocaleTimeString()}
            </span>
            <b style={{ marginLeft: 4 }}>{m.senderId === "me" ? "You" : partnerName}</b>: {m.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", padding: 8, borderTop: "1px solid #ccc" }}>
        <input
          style={{ flex: 1, marginRight: 8 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
