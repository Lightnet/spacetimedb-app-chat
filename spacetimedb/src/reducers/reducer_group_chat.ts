import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { users } from '../tables/table_user';
import { validateMessage, validateName } from '../helper';
import { groupChatMessages } from '../tables/table_group_chat';


//-----------------------------------------------
// GROUP MESSAGE
//-----------------------------------------------
export const create_group_chat = spacetimedb.reducer(
  {name:t.string(), content: t.string() },
  (ctx, { name, content }) => {
  validateMessage(name);
  // console.info(`User ${ctx.sender}: ${name}`);
  const group = ctx.db.groupChats.insert({
    status: undefined,
    id: 0n,
    name: name,
    senderId: ctx.sender,
    content: content,
    createdAt: ctx.timestamp,
    parentId: 0n
  });
  //console.log("group:", group);
  if(group){
    ctx.db.groupChatMembers.insert({
      status: undefined,
      id: 0n,
      createdAt: ctx.timestamp,
      groupId: group.id,
      memberId: ctx.sender,
      role: 'admin'
    });
  }
});
//-----------------------------------------------
// DELETE GROUP CHAT
//-----------------------------------------------
export const delete_group_chat = spacetimedb.reducer(
  {id:t.u64() },
  (ctx, { id }) => {
  console.info(`DELETE Group Chat: ${ctx.sender}: ${id}`);

  ctx.db.groupChats.id.delete(id);

  //look for groupid to delete members.
  for (const member of ctx.db.groupChatMembers.groupId.filter(id)){
    // if (member.groupId == id){
      ctx.db.groupChatMembers.delete(member);
    // }
  }
});
//-----------------------------------------------
// SEND GROUP CHAT MESSAGE
//-----------------------------------------------
export const send_group_chat_message = spacetimedb.reducer(
  {id:t.u64(), content:t.string() },
  (ctx, { id, content }) => {
  console.info(`ctx.sender: ${ctx.sender}  Group Chat Id: ${id}`);

  const _groupChat = ctx.db.groupChats.id.find(id);

  if(_groupChat){
    ctx.db.groupChatMessages.insert({
      id: 0n,
      senderId: ctx.sender,
      content: content,
      createdAt: ctx.timestamp,
      groupId: id
    });
  }
});
//-----------------------------------------------
// CURRENT GROUP CHAT MESSAGE
//-----------------------------------------------
export const set_group_chat_id = spacetimedb.reducer(
  { id:t.u64() },
  (ctx, { id }) => {
    console.info(`ctx.sender: ${ctx.sender}  Group Chat Id: ${id}`);
    const config = ctx.db.groupChatConfigs.identity.find(ctx.sender);

    if(config){
      config.groupChatId = id;
      ctx.db.groupChatConfigs.identity.update(config);
    }else{
      ctx.db.groupChatConfigs.insert({
        status: undefined,
        identity: ctx.sender,
        createdAt: ctx.timestamp,
        groupChatId: id
      })
    }
  }
);

