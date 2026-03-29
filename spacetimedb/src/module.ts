// server api module
// import { ScheduleAt } from 'spacetimedb';
// import { Random } from 'spacetimedb/server';
import { schema, table, t, SenderError  } from 'spacetimedb/server';

import { user, userAvatar } from './models/model_user';
import { groupChat, groupChatConfig, groupChatMember, groupChatMessage } from './models/model_group_chat';
import { directMessage, directMessageConfig } from './models/model_direct_message';
import { generateRandomString } from './helper';
import { messageEvent } from './models/model_event';

//-----------------------------------------------
// Message
//-----------------------------------------------
const message = table(
  { name: 'message', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    senderId: t.identity().index('btree'),
    content: t.string(),
    createdAt: t.timestamp(),
  }
);

//-----------------------------------------------
// SPACETIME SCHEMA
//-----------------------------------------------
const spacetimedb = schema({
  user,
  userAvatar,
  message,
  //=============================================
  directMessage,
  directMessageConfig,
  //=============================================
  groupChat,
  groupChatConfig,
  groupChatMember,
  groupChatMessage,
  //=============================================
  messageEvent,
  //=============================================
  // textChannel,
  // textChannelMember,
  // textChannelMessage
});

//-----------------------------------------------
// INIT
//-----------------------------------------------
export const init = spacetimedb.init(_ctx => {
  console.log("===============INIT SPACETIMEDB APP NAME:::=========");
});
//-----------------------------------------------
// ON CLIENT CONNECT
//-----------------------------------------------
export const onConnect = spacetimedb.clientConnected(ctx => {
  const user = ctx.db.user.identity.find(ctx.sender);
  // console.log("ctx: ",ctx);
  // console.log("connectionId: ",ctx.connectionId); //socket id ???
  // console.log("connectionId: ",ctx.connectionId?.toHexString());
  console.log("SENDER: ",ctx.sender);
  console.log("SENDER: ",ctx.sender.toHexString());
  console.log(ctx.random())
  if (user) {
    ctx.db.user.identity.update({ ...user, online: true });
  } else {
    // let generateName = generateRandomString(ctx,12);

    let generateName = String(ctx.newUuidV7()).replaceAll("-","");
    
    ctx.db.user.insert({
      identity: ctx.sender,
      id: 0n,
      userId: generateName,
      name: generateName,
      online: true,
      status: {tag:"Online"},
      custom_status: undefined,
      accent_color: undefined,
      created_at: ctx.timestamp
    });
  }
});
//-----------------------------------------------
// ON CLIENT DISCONNECT
//-----------------------------------------------
export const onDisconnect = spacetimedb.clientDisconnected(ctx => {
  const user = ctx.db.user.identity.find(ctx.sender);
  if (user) {
    ctx.db.user.identity.update({ 
      ...user, 
      online: false ,
      status: {tag:"Offline"},
    });
    console.info(`Disconnect event for user with identity ${ctx.sender}`);
  } else {
    console.warn(
      `Disconnect event for unknown user with identity ${ctx.sender}`
    );
  }
});
//-----------------------------------------------
// VALID NAME
//-----------------------------------------------
// function validateName(name: string) {
//   if (!name) {
//     throw new SenderError('Names must not be empty');
//   }
// }
//-----------------------------------------------
// SET USER NAME
//-----------------------------------------------
// export const set_name = spacetimedb.reducer({ name: t.string() }, (ctx, { name }) => {
//   // console.info("Name: ",name);
//   validateName(name);
//   const user = ctx.db.user.identity.find(ctx.sender);
//   console.log("[server] Set Name:", name);
//   if (!user) {
//     throw new SenderError('Cannot set name for unknown user');
//   }
//   ctx.db.user.identity.update({ ...user, name });
// });

// export const set_custom_status = spacetimedb.reducer({ text: t.string() }, (ctx, { text }) => {
//   // console.info("Name: ",name);
//   validateName(text);
//   const user = ctx.db.user.identity.find(ctx.sender);
//   console.log("[server] Set Name:", text);
//   if (!user) {
//     throw new SenderError('Cannot set name for unknown custom status');
//   }
//   ctx.db.user.identity.update({ ...user, custom_status:text });
// });
//-----------------------------------------------
// USER CURRENT STATUS
//-----------------------------------------------
// export const current_user = spacetimedb.view(
//   { name: 'current_user', public: true },
//   t.option(user.rowType), // return row data if exist
//   (ctx) => {
//     const _user = ctx.db.user.identity.find(ctx.sender);
//     if(_user){
//       console.log("user: ", _user);
//       return _user;
//     }
//   return undefined;
// });

//-----------------------------------------------
// SEND MESSAGE
//-----------------------------------------------
// function validateMessage(text: string) {
//   if (!text) {
//     throw new SenderError('Messages must not be empty');
//   }
// }

// export const send_message = spacetimedb.reducer({ text: t.string() }, (ctx, { text }) => {
//   validateMessage(text);
//   console.info(`User ${ctx.sender}: ${text}`);
//   ctx.db.message.insert({
//     id:0n,
//     senderId: ctx.sender,
//     content:text,
//     createdAt: ctx.timestamp,
//   });
// });
//-----------------------------------------------
// SEND DIRECT MESSAGE
//-----------------------------------------------
// export const send_direct_message = spacetimedb.reducer(
//   {toId:t.string(), text: t.string() },
//   (ctx, { toId, text }) => {
//   validateMessage(text);
//   console.info(`User ${ctx.sender}: ${text}`);

//   ctx.db.directMessage.insert({
//     id:0n,
//     senderId: ctx.sender,
//     recipientId: ctx.sender,
//     content:text,
//     status:undefined,
//     readAt:undefined,
//     createdAt: ctx.timestamp,
//   });
// });

// get direct message
// need to be private not public
// export const my_direct_message = spacetimedb.view(
//   {name:'my_direct_message', public:true },
//   t.array(directMessage.rowType),
//   (ctx) => {
//     const received = Array.from(
//       ctx.db.directMessage.recipientId.filter(ctx.sender)
//     )
//     return received ?? [];
// });

//-----------------------------------------------
// GROUP MESSAGE
//-----------------------------------------------

// export const create_group_chat = spacetimedb.reducer(
//   {name:t.string(), content: t.string() },
//   (ctx, { name, content }) => {
//   validateMessage(name);
//   console.info(`User ${ctx.sender}: ${name}`);

//   const group = ctx.db.groupChat.insert({
//     status: undefined,
//     id: 0n,
//     name: name,
//     senderId: ctx.sender,
//     content: content,
//     createdAt: ctx.timestamp,
//     parentId: 0n
//   });

//   console.log("group:", group);

//   if(group){
//     ctx.db.groupChatMember.insert({
//       status: undefined,
//       id: 0n,
//       createdAt: ctx.timestamp,
//       groupId: group.id,
//       memberId: ctx.sender,
//       role: 'admin'
//     });
//   }
// });

// need to check for admin before delete checks.
// export const delete_group_chat = spacetimedb.reducer(
//   {id:t.u64() },
//   (ctx, { id }) => {
//   console.info(`DELETE Group Chat: ${ctx.sender}: ${id}`);

//   ctx.db.groupChat.id.delete(id);

//   //look for groupid to delete members.
//   for (const member of ctx.db.groupChatMember.groupId.filter(id)){
//     // if (member.groupId == id){
//       ctx.db.groupChatMember.delete(member);
//     // }
//   }
// });

// need to delete group chat messages

// group chat id message
// export const send_group_chat_message = spacetimedb.reducer(
//   {id:t.u64(), content:t.string() },
//   (ctx, { id, content }) => {
//   console.info(`ctx.sender: ${ctx.sender}  Group Chat Id: ${id}`);

//   const _groupChat = ctx.db.groupChat.id.find(id);

//   if(_groupChat){
//     ctx.db.groupChatMessage.insert({
//       id: 0n,
//       senderId: ctx.sender,
//       content: content,
//       createdAt: ctx.timestamp,
//       groupId: id
//     });
//   }
// });

//-----------------------------------------------
// CURRENT GROUP CHAT MESSAGE
//-----------------------------------------------

// export const set_group_chat_id = spacetimedb.reducer(
//   { id:t.u64() },
//   (ctx, { id }) => {
//     console.info(`ctx.sender: ${ctx.sender}  Group Chat Id: ${id}`);
//     const config = ctx.db.groupChatConfig.identity.find(ctx.sender);
//     if(config){
//       config.groupChatId = id;
//       ctx.db.groupChatConfig.identity.update(config);
//     }else{
//       ctx.db.groupChatConfig.insert({
//         status: undefined,
//         identity: ctx.sender,
//         createdAt: ctx.timestamp,
//         groupChatId: id
//       })
//     }
//   }
// );

// get user id that current group chat messages.
// export const current_group_chat_messages = spacetimedb.view(
//   { name: 'current_group_chat_messages', public: true },
//   t.array(groupChatMessage.rowType), 
//   (ctx) => {
//     //check current user config
//     const _groupConfig = ctx.db.groupChatConfig.identity.find(ctx.sender);
//     if(_groupConfig){
//       //return group chat message to filter by group chat id.
//       return Array.from(ctx.db.groupChatMessage.groupId.filter(_groupConfig.groupChatId));
//     }
//     return [];
//   }
// );

//view all public test
// export const public_test =  spacetimedb.anonymousView(
//   { name: 'public_test', public: true },
//    t.array(groupChatMessage.rowType),
//   (ctx) => {
//     // ctx.sender; // does not exist
//     return ctx.from.groupChatMessage
//       .leftSemijoin(ctx.from.groupChatMember, (g,m)=>g.groupId.eq(m.groupId));
//   });

// user group config set groupChatId to filter.
// export const my_group_chat_messages = spacetimedb.view(
//   { name: 'my_group_chat_messages', public: true },
//   t.array(groupChatMessage.rowType), 
//   (ctx) => {
//     //check current user config
//     const _groupConfig = ctx.db.groupChatConfig.identity.find(ctx.sender);
//     if(_groupConfig){
//       //return group chat message to filter by group chat id.
//       return Array.from(ctx.db.groupChatMessage.groupId.filter(_groupConfig.groupChatId));
//       // return Array.from(ctx.from.groupChatMessage.where(r=>r.groupId.eq(_groupConfig.groupChatId)));
//       // return ctx.from.groupChatMessage.where(r=>r.groupId.eq(_groupConfig.groupChatId));
//       // return Array.from(ctx.from.groupChatMessage.where(r=>r.groupId.eq(_groupConfig.groupChatId)));
//     }
//     return [];
//   }
// );

// testing...
// this view all messages current own user groups
// export const all_group_chat_messages = spacetimedb.view(
//   { name: 'all_group_chat_messages', public: true },
//   t.array(groupChatMessage.rowType), 
//   (ctx) => {

//     // ctx.sender = user id.
//     const groupChatlist = ctx.db.groupChatMember.memberId.filter(ctx.sender);

//     const allowedGroupIds = new Set(
//       Array.from(groupChatlist).map(m => m.groupId)
//     );

//     if (allowedGroupIds.size === 0) {
//       return []; // User is not in any groups
//     }
//     // Get ALL messages and filter to only those in the user's groups
//     const allMessages = ctx.db.groupChatMessage.iter(); // or .filter if you had a range, but here we need multiple values

//     return Array.from(allMessages).filter(msg => 
//       allowedGroupIds.has(msg.groupId)
//     );
//     // return []
//   })

// export const group_test = spacetimedb.reducer(
//   {  },
//   (ctx, {  }) => {
//     console.log("test");
//     // console.info(`ctx.sender: ${ctx.sender}  Group Chat Id: ${id}`);
//     // const config = ctx.db.groupChatConfig.identity.find(ctx.sender);
//     // if(config){
//     //   config.groupChatId = id;
//     //   ctx.db.groupChatConfig.identity.update(config);
//     // }else{
//     //   ctx.db.groupChatConfig.insert({
//     //     status: undefined,
//     //     identity: ctx.sender,
//     //     createdAt: ctx.timestamp,
//     //     groupChatId: id
//     //   })
//     // }
//   }
// );

//-----------------------------------------------
// EXPORT DATABASE
//-----------------------------------------------
export default spacetimedb;
console.log("spacetime-app-chat");

