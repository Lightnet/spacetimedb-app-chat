// group chat tables
// 

import { table, t  } from 'spacetimedb/server';

//-----------------------------------------------
// Group Chat
//-----------------------------------------------

export const groupChat = table(
  { name: 'group_chat', public: true },
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
export const groupChatConfig = table(
  { name: 'group_chat_config', public: true },
  {
    identity:t.identity().primaryKey(),
    groupChatId: t.u64(),
    status: t.string().optional(),
    createdAt: t.timestamp(),
  }
);

// list member to talk group.
export const groupChatMember = table(
  { name: 'group_chat_member', public: true },
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
export const groupChatMessage = table(
  { name: 'group_chat_message', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    groupId:t.u64().index('btree'),
    senderId: t.identity().index('btree'),
    content: t.string(),
    createdAt: t.timestamp(),
  }
);
