

import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { directConversations, directMessages } from '../tables/table_direct_message';
//-----------------------------------------------
// 
//-----------------------------------------------
export const my_direct_messages = spacetimedb.view(
  {name:'my_direct_messages', public:true },
  t.array(directMessages.rowType),
  // @ts-ignore
  (ctx) => {
    const user = ctx.db.users.identity.find(ctx.sender); // Current authenticated user
    if(!user) return [];
    // look for current user from current userid
    const received = ctx.from.directMessages.where(
      r =>r.recipientId.eq(user.userId).or(r.senderId.eq(user.userId))
    )
    return received ?? [];
});

// unread last messages
export const my_conversations = spacetimedb.view(
  {name:'my_conversations', public:true },
  t.array(directConversations.rowType),
  // @ts-ignore
  (ctx) => {

    const user = ctx.db.users.identity.find(ctx.sender); // Current authenticated user
    if(!user) return [];

    // look for current user from current userid
    const received = ctx.from.directConversations.where(
      r =>r.userA.eq(user.userId).or(r.userB.eq(user.userId))
    )
    return received ?? [];
});