import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { user, userAvatar } from '../models/model_user';
import { validateMessage, validateName } from '../helper';
import { groupChatMessage } from '../models/model_group_chat';


export const current_group_chat_messages = spacetimedb.view(
  { name: 'current_group_chat_messages', public: true },
  t.array(groupChatMessage.rowType), 
  (ctx) => {
    //check current user config
    const _groupConfig = ctx.db.groupChatConfig.identity.find(ctx.sender);
    if(_groupConfig){
      //return group chat message to filter by group chat id.
      return Array.from(ctx.db.groupChatMessage.groupId.filter(_groupConfig.groupChatId));
    }
    return [];
  }
);


export const my_group_chat_messages = spacetimedb.view(
  { name: 'my_group_chat_messages', public: true },
  t.array(groupChatMessage.rowType), 
  (ctx) => {
    //check current user config
    const _groupConfig = ctx.db.groupChatConfig.identity.find(ctx.sender);
    if(_groupConfig){
      //return group chat message to filter by group chat id.
      return Array.from(ctx.db.groupChatMessage.groupId.filter(_groupConfig.groupChatId));
      // return Array.from(ctx.from.groupChatMessage.where(r=>r.groupId.eq(_groupConfig.groupChatId)));
      // return ctx.from.groupChatMessage.where(r=>r.groupId.eq(_groupConfig.groupChatId));
      // return Array.from(ctx.from.groupChatMessage.where(r=>r.groupId.eq(_groupConfig.groupChatId)));
    }
    return [];
  }
);

export const all_group_chat_messages = spacetimedb.view(
  { name: 'all_group_chat_messages', public: true },
  t.array(groupChatMessage.rowType), 
  (ctx) => {

    // ctx.sender = user id.
    const groupChatlist = ctx.db.groupChatMember.memberId.filter(ctx.sender);

    const allowedGroupIds = new Set(
      Array.from(groupChatlist).map(m => m.groupId)
    );

    if (allowedGroupIds.size === 0) {
      return []; // User is not in any groups
    }
    // Get ALL messages and filter to only those in the user's groups
    const allMessages = ctx.db.groupChatMessage.iter(); // or .filter if you had a range, but here we need multiple values

    return Array.from(allMessages).filter(msg => 
      allowedGroupIds.has(msg.groupId)
    );
    // return []
  })