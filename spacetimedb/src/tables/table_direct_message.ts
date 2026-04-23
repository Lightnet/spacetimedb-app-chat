// 

import { table, t  } from 'spacetimedb/server';

//-----------------------------------------------
// Direct Message
//-----------------------------------------------
export const directMessages = table(
  { name: 'direct_messages', public: false },
  {
    id:t.u64().primaryKey().autoInc(),
    // Who sent it (use .identity() for SpacetimeDB's native auth)
    senderId: t.string().index('btree'),       // who sent it
    // Who it's for
    recipientId : t.string().index('btree'),   // the other person (in 1:1)
    content: t.string(),
    // Composite index on the conversation for fast lookups + ordering
    // This is the most important optimization for DMs
    conversationIndex: t.string().index('btree'),   // we'll compute this as a normalized key
    status: t.string().default('sent'),             // e.g. 'sent', 'delivered', 'read'
    readAt: t.timestamp().optional(),
    createdAt: t.timestamp(),
  }
);

// Optional: A simple "conversations" or "thread" summary table (highly recommended)
export const conversations = table(
  { name: 'conversations', public: false },
  {
    // Normalized unique key for any two users (smaller ID first)
    id: t.string().primaryKey(),   // e.g. "identityA:identityB" with A < B lexicographically

    userA: t.string(),
    userB: t.string(),
    lastMessageAt: t.timestamp(),
    lastMessagePreview: t.string().optional(),
    unreadCountA: t.u32().default(0),
    unreadCountB: t.u32().default(0),
  }
);

export const directMessageConfigs = table(
  { name: 'direct_message_configs', public: true },
  {
    identity:t.identity().primaryKey(),
    senderId:t.identity().optional(), // from user
    userName:t.string().optional(),
    // isSingle:t.bool().default(true),// view message from one or many messages to filter.
    // isBlock:t.bool().default(false),
    // status: t.string().optional(),
    // readAt: t.timestamp().optional(),
    createdAt: t.timestamp(),
  }
);