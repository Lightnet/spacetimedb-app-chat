// Model User for tables

import { table, t } from 'spacetimedb/server';
import { status } from '../types';

export const users = table(
  { 
    name: 'users', 
    public: true,
  },
  {
    id:t.u64().autoInc(),
    identity: t.identity().primaryKey(),
    userId: t.string().unique(),
    name: t.string().optional(), // user name
    // status: t.enum(['online', 'idle', 'dnd', 'offline']).default('offline'), 
    status: status,
    custom_status:t.string().optional(), // current status custom text
    // bio: t.string().optional(), // user info
    // title: t.string().optional(), // job or rank or 
    online: t.bool(),
    accent_color: t.u32().optional(),
    created_at:   t.timestamp(),
  }
);

