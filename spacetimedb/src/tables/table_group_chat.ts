// group chat tables
// 

import { table, t  } from 'spacetimedb/server';

//-----------------------------------------------
// Group Chat
//-----------------------------------------------

export const groupChats = table(
  { name: 'group_chats', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    parentId:t.u64(),
    senderId: t.identity().index('btree'),
    name: t.string(),
    content: t.string().optional(),
    status: t.string().optional(),
    createdAt: t.timestamp(),
  }
);
// group chat config for set and get current group chat
export const groupChatConfigs = table(
  { name: 'group_chat_configs', public: true },
  {
    identity:t.identity().primaryKey(),
    groupChatId: t.u64(),
    status: t.string().optional(),
    createdAt: t.timestamp(),
  }
);

// list member to talk group.
export const groupChatMembers = table(
  { name: 'group_chat_members', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    groupId:t.u64().index('btree'),
    memberId: t.identity().index('btree'),
    status: t.string().optional(),
    role: t.string().optional(),
    createdAt: t.timestamp(),
  }
);
//-----------------------------------------------
// Group Message
//-----------------------------------------------
export const groupChatMessages = table(
  { name: 'group_chat_messages', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    groupId:t.u64().index('btree'),
    senderId: t.identity().index('btree'),
    content: t.string(),
    createdAt: t.timestamp(),
  }
);
