import { table, t  } from 'spacetimedb/server';



//-----------------------------------------------
// Server
//-----------------------------------------------
// const server = table(
//   { name: 'server', public: true },
//   {
//     id:t.u64().primaryKey().autoInc(),
//     senderId: t.identity(),
//     name: t.string(),
//     content: t.string().optional(),
//     status: t.string().optional(),
//     createdAt: t.timestamp(),
//   }
// );
//-----------------------------------------------
// Category
//-----------------------------------------------
// const category = table(
//   { name: 'category', public: true },
//   {
//     id:t.u64().primaryKey().autoInc(),
//     parentId:t.u64(),
//     senderId: t.identity(),
//     name: t.string(),
//     content: t.string().optional(),
//     status: t.string().optional(),
//     createdAt: t.timestamp(),
//   }
// );

//-----------------------------------------------
// Text Channel
//-----------------------------------------------
export const textChannel = table(
  { name: 'text_channel', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    parentId:t.u64(),
    senderId: t.identity(),
    name: t.string(),
    content: t.string().optional(),
    status: t.string().optional(),
    createdAt: t.timestamp(),
  }
);

export const textChannelMember  = table(
  { name: 'text_channel_member', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    parentId:t.u64(),
    senderId: t.identity(),
    role: t.string().optional(),
    content: t.string().optional(),
    status: t.string().optional(),
    createdAt: t.timestamp(),
  }
);

export const textChannelMessage  = table(
  { name: 'text_channel_message', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    parentId:t.u64(),
    senderId: t.identity(),
    content: t.string().optional(),
    createdAt: t.timestamp(),
  }
);



