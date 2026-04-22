// 

import { t, table } from "spacetimedb/server";

export const messages = table(
  { name: 'messages', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    userId:t.string(),
    content: t.string().optional(),
    createdAt: t.timestamp(),
  }
);
