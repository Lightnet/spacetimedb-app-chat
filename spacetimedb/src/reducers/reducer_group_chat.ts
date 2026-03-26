import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { user, userAvatar } from '../models/model_user';
import { validateMessage, validateName } from '../helper';
import { groupChatMessage } from '../models/model_group_chat';


//-----------------------------------------------
// GROUP MESSAGE
//-----------------------------------------------
export const create_group_chat = spacetimedb.reducer(
  {name:t.string(), content: t.string() },
  (ctx, { name, content }) => {
  validateMessage(name);
  console.info(`User ${ctx.sender}: ${name}`);

  const group = ctx.db.groupChat.insert({
    status: undefined,
    id: 0n,
    name: name,
    senderId: ctx.sender,
    content: content,
    createdAt: ctx.timestamp,
    parentId: 0n
  });

  console.log("group:", group);

  if(group){
    ctx.db.groupChatMember.insert({
      status: undefined,
      id: 0n,
      createdAt: ctx.timestamp,
      groupId: group.id,
      memberId: ctx.sender,
      role: 'admin'
    });
  }
});


export const delete_group_chat = spacetimedb.reducer(
  {id:t.u64() },
  (ctx, { id }) => {
  console.info(`DELETE Group Chat: ${ctx.sender}: ${id}`);

  ctx.db.groupChat.id.delete(id);

  //look for groupid to delete members.
  for (const member of ctx.db.groupChatMember.groupId.filter(id)){
    // if (member.groupId == id){
      ctx.db.groupChatMember.delete(member);
    // }
  }
});


export const send_group_chat_message = spacetimedb.reducer(
  {id:t.u64(), content:t.string() },
  (ctx, { id, content }) => {
  console.info(`ctx.sender: ${ctx.sender}  Group Chat Id: ${id}`);

  const _groupChat = ctx.db.groupChat.id.find(id);

  if(_groupChat){
    ctx.db.groupChatMessage.insert({
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
    const config = ctx.db.groupChatConfig.identity.find(ctx.sender);

    if(config){
      config.groupChatId = id;
      ctx.db.groupChatConfig.identity.update(config);
    }else{
      ctx.db.groupChatConfig.insert({
        status: undefined,
        identity: ctx.sender,
        createdAt: ctx.timestamp,
        groupChatId: id
      })
    }
  }
);

