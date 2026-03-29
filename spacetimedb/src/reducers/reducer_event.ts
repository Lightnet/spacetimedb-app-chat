// test sample

import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';

// https://spacetimedb.com/docs/tables/event-tables
// trigger once and remove from the table event
export const set_message_event = spacetimedb.reducer(
  { message: t.string() }, 
  (ctx, { message }) => {
    ctx.db.messageEvent.insert({
      message: message,
      senderId: ctx.sender,
      source: 'test'
    })
  }
);

// client code 
// conn.db.messageEvent.onInsert((ctx, event) => {
//   console.log(`SenderId: ${event.senderId} Msg: ${event.message} damage from ${event.source}`);
// });