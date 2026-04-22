// test sample

import { t } from "spacetimedb/server";
import { validateMessage } from "../helper";
import spacetimedb from "../module";
//-----------------------------------------------
// SEND MESSAGE
//-----------------------------------------------
export const send_message = spacetimedb.reducer({ text: t.string() }, (ctx, { text }) => {
  validateMessage(text);
  console.info(`User ${ctx.sender}: ${text}`);

  const user =  ctx.db.users.identity.find(ctx.sender)
  if(!user) return;

  ctx.db.messages.insert({
    id:0n,
    userId: user.userId,
    content:text,
    createdAt: ctx.timestamp,
  });
});
//-----------------------------------------------
// UPDATE MESSAGE
//-----------------------------------------------
export const update_message = spacetimedb.reducer({ id: t.string() }, (ctx, { id }) => {
  console.info(`User: ${ctx.sender} Id: ${id}`);


  // ctx.db.message.insert({
  //   id:0n,
  //   senderId: ctx.sender,
  //   content:text,
  //   createdAt: ctx.timestamp,
  // });
});
//-----------------------------------------------
// DELETE MESSAGE
//-----------------------------------------------
export const delete_message = spacetimedb.reducer({ id: t.string() }, (ctx, { id }) => {
  console.info(`User: ${ctx.sender} Id: ${id}`);
  // ctx.db.message.insert({
  //   id:0n,
  //   senderId: ctx.sender,
  //   content:text,
  //   createdAt: ctx.timestamp,
  // });
});