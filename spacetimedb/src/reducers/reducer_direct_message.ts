

import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { validateMessage } from '../helper';
import { directMessages } from '../tables/table_direct_message';


//-----------------------------------------------
// SEND DIRECT MESSAGE
//-----------------------------------------------
export const send_direct_message = spacetimedb.reducer(
  {toId:t.string(), text: t.string() },
  (ctx, { toId, text }) => {
  validateMessage(text);
  console.info(`User ${ctx.sender}: ${text}`);

  ctx.db.directMessages.insert({
    id:0n,
    senderId: ctx.sender,
    recipientId: ctx.sender,
    content:text,
    status:undefined,
    readAt:undefined,
    createdAt: ctx.timestamp,
  });
});
//-----------------------------------------------
// 
//-----------------------------------------------
export const my_direct_message = spacetimedb.view(
  {name:'my_direct_message', public:true },
  t.array(directMessages.rowType),
  (ctx) => {
    const received = Array.from(
      ctx.db.directMessages.recipientId.filter(ctx.sender)
    )
    return received ?? [];
});

