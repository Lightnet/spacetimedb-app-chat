// 

import { table, t  } from 'spacetimedb/server';

//-----------------------------------------------
// Direct Message
//-----------------------------------------------
export const directMessages = table(
  { name: 'direct_messages', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    senderId: t.identity().index('btree'),       // who sent it
    recipientId : t.identity().index('btree'),   // the other person (in 1:1)
    content: t.string(),
    status: t.string().optional(),
    readAt: t.timestamp().optional(),
    createdAt: t.timestamp(),
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