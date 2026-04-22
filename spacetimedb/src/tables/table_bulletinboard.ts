// 

import { table, t  } from 'spacetimedb/server';


export const BoardMessages = table(
  { name: 'board_messages', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    userId: t.identity(),
    parentId: t.u64().optional(),
    subject: t.string(),
    content: t.string(),
    createdAt: t.timestamp(),
  }
);

export const BoardTopics = table(
  { name: 'board_topics', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    userId: t.identity(),
    parentId: t.u64().optional(),
    subject: t.string(),
    content: t.string(),
    createdAt: t.timestamp(),
  }
);