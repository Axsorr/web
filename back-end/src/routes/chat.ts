import { Router } from "express";
import {
  ensureChatWithUser,
  getChatMessages,
  listChatsForUser,
  markChatAsRead,
  seedChatData,
  sendMessage,
  setPresence,
  setTyping,
  subscribe,
} from "../services/chat.service.js";

seedChatData();

export const chatRouter = Router();

function userIdFrom(req: { query: Record<string, unknown> }) {
  const userId = req.query.userId;
  if (typeof userId !== "string") throw new Error("UNAUTHORIZED");
  return userId;
}

chatRouter.post("/with/:otherUserId", (req, res) => {
  try {
    const me = userIdFrom(req);
    const chat = ensureChatWithUser(me, req.params.otherUserId);
    res.json({ id: chat.id });
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

chatRouter.get("/chats", (req, res) => {
  try {
    const me = userIdFrom(req);
    res.json({ chats: listChatsForUser(me) });
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

chatRouter.get("/chats/:chatId/messages", (req, res) => {
  try {
    const me = userIdFrom(req);
    const limit = Number(req.query.limit ?? 20);
    const before = typeof req.query.before === "string" ? req.query.before : undefined;
    const data = getChatMessages(me, req.params.chatId, Number.isFinite(limit) ? limit : 20, before);
    res.json(data);
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

chatRouter.post("/chats/:chatId/messages", (req, res) => {
  try {
    const me = userIdFrom(req);
    const content = typeof req.body.content === "string" ? req.body.content : "";
    const message = sendMessage(me, req.params.chatId, content);
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof Error && error.message === "VALIDATION") {
      res.status(400).json({ error: "content required" });
      return;
    }
    res.status(404).json({ error: "not found" });
  }
});

chatRouter.post("/chats/:chatId/read", (req, res) => {
  try {
    const me = userIdFrom(req);
    markChatAsRead(me, req.params.chatId);
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

chatRouter.post("/chats/:chatId/typing", (req, res) => {
  try {
    const me = userIdFrom(req);
    setTyping(me, req.params.chatId, Boolean(req.body.isTyping));
    res.status(202).send();
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

chatRouter.get("/stream", (req, res) => {
  try {
    const me = userIdFrom(req);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    setPresence(me, "online");

    const unsubscribe = subscribe(me, (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    const keepAlive = setInterval(() => {
      res.write(`event: ping\ndata: ${Date.now()}\n\n`);
    }, 25_000);

    req.on("close", () => {
      clearInterval(keepAlive);
      unsubscribe();
      setPresence(me, "offline");
      res.end();
    });
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
});
