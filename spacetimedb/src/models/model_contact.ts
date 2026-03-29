// Model contact for tables

import { table, t } from 'spacetimedb/server';
// import { status } from '../types';



export const contact = table(
  { 
    name: 'contact', 
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

