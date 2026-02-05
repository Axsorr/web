import { randomUUID } from "node:crypto";

export type PresenceState = "online" | "offline";

export type ChatSummary = {
  id: string;
  partnerId: string;
  partnerName: string;
  lastMessage: { id: string; content: string; createdAt: string } | null;
  unreadCount: number;
  partnerPresence: PresenceState;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

type ChatRoom = {
  id: string;
  members: [string, string];
  messages: ChatMessage[];
  unreadByUserId: Record<string, number>;
};

type User = {
  id: string;
  name: string;
};

type Event =
  | { type: "message:new"; chatId: string; payload: ChatMessage }
  | { type: "chat:read"; chatId: string; userId: string }
  | { type: "typing"; chatId: string; userId: string; isTyping: boolean }
  | { type: "presence"; userId: string; status: PresenceState };

const users = new Map<string, User>([
  ["u1", { id: "u1", name: "Axsor" }],
  ["u2", { id: "u2", name: "Tazo" }],
  ["u3", { id: "u3", name: "Lana" }],
]);

const chats = new Map<string, ChatRoom>();
const chatByMembers = new Map<string, string>();
const onlineUsers = new Set<string>();
const listeners = new Map<string, Set<(event: Event) => void>>();

function membersKey(a: string, b: string) {
  return [a, b].sort().join("::");
}

function getOrCreateChat(a: string, b: string): ChatRoom {
  const key = membersKey(a, b);
  const existingId = chatByMembers.get(key);
  if (existingId) {
    const chat = chats.get(existingId);
    if (chat) return chat;
  }

  const id = randomUUID();
  const chat: ChatRoom = {
    id,
    members: [a, b],
    messages: [],
    unreadByUserId: { [a]: 0, [b]: 0 },
  };

  chats.set(id, chat);
  chatByMembers.set(key, id);
  return chat;
}

function emitToUsers(userIds: string[], event: Event) {
  for (const userId of userIds) {
    const handlers = listeners.get(userId);
    if (!handlers) continue;
    for (const cb of handlers) cb(event);
  }
}

export function seedChatData() {
  const chat = getOrCreateChat("u1", "u2");
  if (chat.messages.length > 0) return;

  const now = Date.now();
  const m1: ChatMessage = {
    id: randomUUID(),
    chatId: chat.id,
    senderId: "u2",
    content: "Yo Axsor, let us test realtime chat.",
    createdAt: new Date(now - 12 * 60_000).toISOString(),
  };
  const m2: ChatMessage = {
    id: randomUUID(),
    chatId: chat.id,
    senderId: "u1",
    content: "Sure, send me new updates when your pages are reactive 👀",
    createdAt: new Date(now - 11 * 60_000).toISOString(),
  };
  chat.messages.push(m1, m2);
}

export function getUserOrThrow(userId: string) {
  const user = users.get(userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
}

export function ensureChatWithUser(meId: string, otherId: string) {
  getUserOrThrow(meId);
  getUserOrThrow(otherId);
  return getOrCreateChat(meId, otherId);
}

export function listChatsForUser(userId: string): ChatSummary[] {
  getUserOrThrow(userId);

  const mine = Array.from(chats.values())
    .filter((chat) => chat.members.includes(userId))
    .map((chat) => {
      const partnerId = chat.members.find((id) => id !== userId)!;
      const partner = getUserOrThrow(partnerId);
      const lastMessage = chat.messages[chat.messages.length - 1] ?? null;

      return {
        id: chat.id,
        partnerId,
        partnerName: partner.name,
        unreadCount: chat.unreadByUserId[userId] ?? 0,
        partnerPresence: onlineUsers.has(partnerId) ? "online" : "offline",
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
            }
          : null,
      } satisfies ChatSummary;
    })
    .sort((a, b) => {
      const t1 = a.lastMessage ? Date.parse(a.lastMessage.createdAt) : 0;
      const t2 = b.lastMessage ? Date.parse(b.lastMessage.createdAt) : 0;
      return t2 - t1;
    });

  return mine;
}

export function getChatMessages(userId: string, chatId: string, limit: number, before?: string) {
  getUserOrThrow(userId);
  const chat = chats.get(chatId);
  if (!chat || !chat.members.includes(userId)) throw new Error("NOT_FOUND");

  const beforeTs = before ? Date.parse(before) : Number.POSITIVE_INFINITY;
  const filtered = chat.messages.filter((msg) => Date.parse(msg.createdAt) < beforeTs);
  const slice = filtered.slice(Math.max(0, filtered.length - limit));
  const nextCursor =
    filtered.length > slice.length && slice[0] ? slice[0].createdAt : null;

  return { messages: slice, nextCursor };
}

export function sendMessage(userId: string, chatId: string, content: string) {
  getUserOrThrow(userId);
  const chat = chats.get(chatId);
  if (!chat || !chat.members.includes(userId)) throw new Error("NOT_FOUND");

  const clean = content.trim();
  if (!clean) throw new Error("VALIDATION");

  const msg: ChatMessage = {
    id: randomUUID(),
    chatId,
    senderId: userId,
    content: clean,
    createdAt: new Date().toISOString(),
  };

  chat.messages.push(msg);

  for (const member of chat.members) {
    if (member === userId) continue;
    chat.unreadByUserId[member] = (chat.unreadByUserId[member] ?? 0) + 1;
  }

  emitToUsers(chat.members, { type: "message:new", chatId, payload: msg });
  return msg;
}

export function markChatAsRead(userId: string, chatId: string) {
  getUserOrThrow(userId);
  const chat = chats.get(chatId);
  if (!chat || !chat.members.includes(userId)) throw new Error("NOT_FOUND");

  chat.unreadByUserId[userId] = 0;
  emitToUsers(chat.members, { type: "chat:read", chatId, userId });
}

export function setTyping(userId: string, chatId: string, isTyping: boolean) {
  getUserOrThrow(userId);
  const chat = chats.get(chatId);
  if (!chat || !chat.members.includes(userId)) throw new Error("NOT_FOUND");

  const targets = chat.members.filter((member) => member !== userId);
  emitToUsers(targets, { type: "typing", chatId, userId, isTyping });
}

export function setPresence(userId: string, status: PresenceState) {
  getUserOrThrow(userId);
  if (status === "online") onlineUsers.add(userId);
  else onlineUsers.delete(userId);

  for (const chat of chats.values()) {
    if (!chat.members.includes(userId)) continue;
    const targets = chat.members.filter((m) => m !== userId);
    emitToUsers(targets, { type: "presence", userId, status });
  }
}

export function subscribe(userId: string, cb: (event: Event) => void) {
  getUserOrThrow(userId);
  const set = listeners.get(userId) ?? new Set<(event: Event) => void>();
  set.add(cb);
  listeners.set(userId, set);

  return () => {
    const handlers = listeners.get(userId);
    if (!handlers) return;
    handlers.delete(cb);
    if (handlers.size === 0) listeners.delete(userId);
  };
}
