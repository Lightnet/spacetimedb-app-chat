// Model User for tables

import { table, t } from 'spacetimedb/server';
import { status } from '../types';

export const users = table(
  { 
    name: 'users', 
    public: true,
  },
  {
    userId: t.string().primaryKey(),
    identity: t.identity().unique(),// token 
    name: t.string().unique(), // user name
    status: status,
    custom_status:t.string().optional(), // current status custom text
    // bio: t.string().optional(), // user info
    // title: t.string().optional(), // job or rank or 
    online: t.bool(),
    accent_color: t.u32().optional(),
    created_at:   t.timestamp(),
  }
);

