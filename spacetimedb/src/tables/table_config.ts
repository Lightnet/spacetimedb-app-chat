// Model table config

// need default config for new user
// 

import { table, t } from 'spacetimedb/server';
// import { status } from '../types';

export const configs = table(
  { 
    name: 'config', 
    public: true,
  },
  {
    identity: t.identity().primaryKey(),
    connection_id: t.connectionId().unique(),
    connected_at: t.timestamp(),
  }
);