

import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { directMessages } from '../tables/table_direct_message';
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
    // console.log(user);
    // console.log("my_direct_messages ... ");
    // const received = Array.from(
      // ctx.db.directMessages.recipientId.filter(m=>m user.userId)
      // ctx.from.directMessages.where(r=>r.recipientId.eq(user.userId).or(r.senderId.eq(user.userId)))
    // )

    // look for current user from current userid
    const received = ctx.from.directMessages.where(
      r =>r.recipientId.eq(user.userId).or(r.senderId.eq(user.userId))
    )
    return received ?? [];
});