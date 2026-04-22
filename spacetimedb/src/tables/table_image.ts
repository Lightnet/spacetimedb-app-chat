// TABLE IMAGE

import { table, t } from 'spacetimedb/server';

//-----------------------------------------------
// Avatar Image Data Store
//-----------------------------------------------
export const userAvatars = table(
  { name: 'user_avatars', public: true },
  {
    userId: t.string().primaryKey(),
    mimeType: t.string(),
    data: t.array(t.u8()),  // Binary data stored inline
    uploadedAt: t.timestamp(),
  }
);