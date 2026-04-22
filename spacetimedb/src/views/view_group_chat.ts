//-----------------------------------------------
// 
//-----------------------------------------------
import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { user, userAvatar } from '../models/model_user';
import { validateMessage, validateName } from '../helper';
import { groupChatMessage } from '../models/model_group_chat';
//-----------------------------------------------
// view set current group id chat
//-----------------------------------------------
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
//-----------------------------------------------
// filter base on current user join groups.
//-----------------------------------------------
export const all_group_chat_messages = spacetimedb.view(
  { name: 'all_group_chat_messages', public: true },
  t.array(groupChatMessage.rowType),
  (ctx) => {
    // ctx.sender = user id.
    //get current group that user join
    // const groupChatlist = ctx.db.groupChatMember.memberId.filter(ctx.sender);
    // const allowedGroupIds = new Set(
    //   Array.from(groupChatlist).map(m => m.groupId)
    // );
    // if (allowedGroupIds.size === 0) {
    //   return []; // User is not in any groups
    // }
    // // Get ALL messages and filter to only those in the user's groups
    // const allMessages = ctx.db.groupChatMessage.iter(); // or .filter if you had a range, but here we need multiple values
    // return Array.from(allMessages).filter(msg => 
    //   allowedGroupIds.has(msg.groupId)
    // );
    // ctx.db.groupChatMessage.groupId. filter(msg => allowedGroupIds.has(msg.groupId))

    // g=group
    // m=member
    return ctx.from.groupChatMessage
      .leftSemijoin(ctx.from.groupChatMember, (g,m)=>g.groupId.eq(m.groupId).and(m.memberId.eq(ctx.sender)))
    // return []
  })
