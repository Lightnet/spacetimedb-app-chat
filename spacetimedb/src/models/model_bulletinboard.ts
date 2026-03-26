// 

import { table, t  } from 'spacetimedb/server';


export const BoardMessage = table(
  { name: 'board_message', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    userId: t.identity(),
    parentId: t.u64().optional(),
    subject: t.string(),
    content: t.string(),
    createdAt: t.timestamp(),
  }
);

export const BoardTopic = table(
  { name: 'board_topic', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    userId: t.identity(),
    parentId: t.u64().optional(),
    subject: t.string(),
    content: t.string(),
    createdAt: t.timestamp(),
  }
);