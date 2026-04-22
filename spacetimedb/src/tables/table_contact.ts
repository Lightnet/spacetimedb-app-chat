// table contact

import { table, t } from 'spacetimedb/server';

export const contacts = table(
  { 
    name: 'contacts', 
    public: true,
  },
  {
    id:t.string().primaryKey(),
    identity: t.string().index('btree'),
    userId:t.string(),
    isBlock:t.bool().default(false),
    created_at: t.timestamp(),
  }
);

