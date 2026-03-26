// Model User for tables

import { table, t } from 'spacetimedb/server';
import { status } from '../types';

export const user = table(
  { 
    name: 'user', 
    public: true,
  },
  {
    identity: t.identity().primaryKey(),
    id:t.u64().autoInc(),
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
//-----------------------------------------------
// Avatar Image Data Store
//-----------------------------------------------
export const userAvatar = table(
  { name: 'user_avatar', public: true },
  {
    userId: t.u64().primaryKey(),
    mimeType: t.string(),
    data: t.array(t.u8()),  // Binary data stored inline
    uploadedAt: t.timestamp(),
  }
);

