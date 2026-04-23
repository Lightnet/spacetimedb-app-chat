

import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { validateMessage } from '../helper';
import { directMessages } from '../tables/table_direct_message';


//-----------------------------------------------
// SEND DIRECT MESSAGE
//-----------------------------------------------
export const send_direct_message = spacetimedb.reducer(
  {id:t.string(), text: t.string() },
  (ctx, { id, text }) => {
  // validateMessage(text);
  console.info(`User ${ctx.sender}: ${text}`);
  const user = ctx.db.users.identity.find(ctx.sender); // Current authenticated user
  if(!user) return;

  if (user.userId === id) throw new Error("Cannot message yourself");
  const now = ctx.timestamp;
  const senderId = user.userId;
  const recipientId = id;

  // Create normalized conversation key (always smaller first)
  const convKey = senderId < id 
    ? `${senderId}:${id}` 
    : `${id}:${senderId}`;


  ctx.db.directMessages.insert({
    id: 0n,
    senderId: user.userId,
    recipientId: id,
    content: text,
    readAt: undefined,
    createdAt: now,
    conversationIndex: convKey,
    status: 'send'
  });

  // Update or create conversation summary
  let conv = ctx.db.conversations.id.find(convKey);
  if (!conv) {
    conv = {
        id: convKey,
        userA: senderId < recipientId ? senderId : recipientId,
        userB: senderId < recipientId ? recipientId : senderId,
        lastMessageAt: now,
        lastMessagePreview: text.slice(0, 100),
        unreadCountA: 0,
        unreadCountB: 0,
      };
      ctx.db.conversations.insert(conv);
  }else{
    // Update existing conversation
    ctx.db.conversations.id.update({
      ...conv,
      lastMessageAt: now,
      lastMessagePreview: text.slice(0, 100),
    });

  }
  console.log("finsihed.");
});

