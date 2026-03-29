// test sample

import { t } from "spacetimedb/server";
import { validateMessage } from "../helper";
import spacetimedb from "../module";

export const send_message = spacetimedb.reducer({ text: t.string() }, (ctx, { text }) => {
  validateMessage(text);
  console.info(`User ${ctx.sender}: ${text}`);
  ctx.db.message.insert({
    id:0n,
    senderId: ctx.sender,
    content:text,
    createdAt: ctx.timestamp,
  });
});