// server api module
import { ScheduleAt } from 'spacetimedb';
import { schema, table, t, SenderError  } from 'spacetimedb/server';
import { customAlphabet } from 'nanoid';

// Define your helper
const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const generateShortId = customAlphabet(alphabet, 12); // Default length of 12

// Define an enum for status
// const Status = t.enum('Status', {
//   Active: t.unit(),
//   Inactive: t.unit(),
//   Suspended: t.object('SuspendedInfo', { reason: t.string() }),
// });

const status = t.enum('Status', ['Online', 'Offline','Idle','Busy']);

// status.default();

//-----------------------------------------------
// TABLES
//-----------------------------------------------
const user = table(
  { 
    name: 'user', 
    public: true,
  },
  {
    identity: t.identity().primaryKey(),
    id:t.u64().autoInc(),
    name: t.string().optional(), // user name
    // status: t.enum(['online', 'idle', 'dnd', 'offline']).default('offline'), 
    status: status,
    custom_status:t.string().optional(), // current status custom text
    // bio: t.string().optional(), // user info
    // title: t.string().optional(), // job or rank or 
    online: t.bool(),
    accent_color: t.u32().optional(),
    created_at:   t.timestamp(),
  }
);
//-----------------------------------------------
// Avatar Image Data Store
//-----------------------------------------------
const userAvatar = table(
  { name: 'user_avatar', public: true },
  {
    userId: t.u64().primaryKey(),
    mimeType: t.string(),
    data: t.array(t.u8()),  // Binary data stored inline
    uploadedAt: t.timestamp(),
  }
);

//-----------------------------------------------
// Server
//-----------------------------------------------
// const server = table(
//   { name: 'server', public: true },
//   {
//     id:t.u64().primaryKey().autoInc(),
//     senderId: t.identity(),
//     name: t.string(),
//     content: t.string().optional(),
//     status: t.string().optional(),
//     createdAt: t.timestamp(),
//   }
// );
//-----------------------------------------------
// Category
//-----------------------------------------------
// const category = table(
//   { name: 'category', public: true },
//   {
//     id:t.u64().primaryKey().autoInc(),
//     parentId:t.u64(),
//     senderId: t.identity(),
//     name: t.string(),
//     content: t.string().optional(),
//     status: t.string().optional(),
//     createdAt: t.timestamp(),
//   }
// );
//-----------------------------------------------
// Text Channel
//-----------------------------------------------
const textChannel = table(
  { name: 'text_channel', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    parentId:t.u64(),
    senderId: t.identity(),
    name: t.string(),
    content: t.string().optional(),
    status: t.string().optional(),
    createdAt: t.timestamp(),
  }
);

const textChannelMember  = table(
  { name: 'text_channel_member', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    parentId:t.u64(),
    senderId: t.identity(),
    role: t.string().optional(),
    content: t.string().optional(),
    status: t.string().optional(),
    createdAt: t.timestamp(),
  }
);

const textChannelMessage  = table(
  { name: 'text_channel_message', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    parentId:t.u64(),
    senderId: t.identity(),
    content: t.string().optional(),
    createdAt: t.timestamp(),
  }
);
//-----------------------------------------------
// Group Chat
//-----------------------------------------------
const groupChat = table(
  { name: 'group_chat', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    parentId:t.u64(),
    senderId: t.identity().index('btree'),
    name: t.string(),
    content: t.string().optional(),
    status: t.string().optional(),
    createdAt: t.timestamp(),
  }
);
// group chat config for set and get current group chat
const groupChatConfig = table(
  { name: 'group_chat_config', public: true },
  {
    identity:t.identity().primaryKey(),
    groupChatId: t.u64(),
    status: t.string().optional(),
    createdAt: t.timestamp(),
  }
);

// list member to talk group.
const groupChatMember = table(
  { name: 'group_chat_member', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    groupId:t.u64().index('btree'),
    memberId: t.identity(),
    status: t.string().optional(),
    role: t.string().optional(),
    createdAt: t.timestamp(),
  }
);
//-----------------------------------------------
// Group Message
//-----------------------------------------------
const groupChatMessage = table(
  { name: 'group_chat_message', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    groupId:t.u64().index('btree'),
    senderId: t.identity().index('btree'),
    content: t.string(),
    createdAt: t.timestamp(),
  }
);

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
// Direct Message
//-----------------------------------------------
const directMessage = table(
  { name: 'direct_message', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    senderId: t.identity().index('btree'),       // who sent it
    recipientId : t.identity().index('btree'),   // the other person (in 1:1)
    content: t.string(),
    status: t.string().optional(),
    readAt: t.timestamp().optional(),
    createdAt: t.timestamp(),
  }
);

const directMessageConfig = table(
  { name: 'direct_message_config', public: true },
  {
    identity:t.identity().primaryKey(),
    senderId:t.identity().optional(), // from user
    userName:t.string().optional(),
    // isSingle:t.bool().default(true),// view message from one or many messages to filter.
    // isBlock:t.bool().default(false),
    // status: t.string().optional(),
    // readAt: t.timestamp().optional(),
    createdAt: t.timestamp(),
  }
);

//-----------------------------------------------
// 
//-----------------------------------------------

const BoardMessage = table(
  { name: 'board_message', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    userId: t.identity(),
    parentId: t.u64().optional(),
    subject: t.string(),
    content: t.string(),
    createdAt: t.timestamp(),
  }
);

const BoardTopic = table(
  { name: 'board_topic', public: true },
  {
    id:t.u64().primaryKey().autoInc(),
    userId: t.identity(),
    parentId: t.u64().optional(),
    subject: t.string(),
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
  textChannel,
  textChannelMember,
  textChannelMessage
});
//-----------------------------------------------
// UPLOAD AVATAR IMAGE
//-----------------------------------------------
export const upload_avatar = spacetimedb.reducer({
  userId: t.u64(),
  mimeType: t.string(),
  data: t.array(t.u8()),
}, (ctx, { userId, mimeType, data }) => {

  const user = ctx.db.user.identity.find(ctx.sender);
  // console.log(user);

  if(user){
    // console.log("user: ", user);
    // console.log("mimeType: ", mimeType);
    // console.log("data: ", data);
    // Delete existing avatar if present
    ctx.db.userAvatar.userId.delete(user.id);

    // Insert new avatar
    ctx.db.userAvatar.insert({
      userId:user.id,
      mimeType,
      data,
      uploadedAt: ctx.timestamp,
    });
  }
});
//-----------------------------------------------
// USER CURRENT CLIENT AVATAR COUNT
//-----------------------------------------------
export const user_avatar_count = spacetimedb.reducer({},(ctx, args ) => {
  console.log("ctx.db.userAvatar.count(): ", ctx.db.userAvatar.count());
  const user = ctx.db.user.identity.find(ctx.sender);

  if(user){
    // console.log("user id exist:", ctx.db.userAvatar.userId.find(user.id));
    for (const row of ctx.db.userAvatar.iter()) {
      console.log("Found avatar for user:", row.userId);
      // Do something with row.data...
      // console.log(row );
    }
  }
});
//-----------------------------------------------
// GET CURRENT AVATAR IMAGE
//-----------------------------------------------
// testing get image
export const get_avatar = spacetimedb.procedure(
  { id:t.u64() }, 
  // t.object('Name', { data: t.array(t.u8()),type:t.string()  }),
  // t.object('AvatarResult', { 
  t.object('Name', { //return data if exist
    data: t.option(t.array(t.u8())), 
    type: t.string() 
  }),
  (ctx,{id})=>{
  // let data=null;
  // let type=null;
  let file = ctx.withTx(ctx => {
    const user = ctx.db.user.identity.find(ctx.sender);
    if(user){
      const user_avatar = ctx.db.userAvatar.userId.find(user.id);
      // console.log("user id exist:", user_avatar?.userId);
      if(user_avatar){
        // data = user_avatar.data;
        // type = user_avatar.mimeType;
        return { data: user_avatar.data, type: user_avatar.mimeType };
      }
      return null;
    }
  });
  // console.log("test", test);
  // console.log("test", test?.type);
  // console.log("test");
  if(file){
    return {data:file?.data, type:file?.type};
  }else{
    return { data: undefined, type: "" };
  }
  
  // return {data:"ss",type:"test"}
  // return {data:data,type:type}
})
//-----------------------------------------------
// GET CURRENT AVATAR IMAGE VIEW
//-----------------------------------------------
// https://spacetimedb.com/docs/functions/views
export const user_current_avatar = spacetimedb.view(
  { name: 'user_current_avatar', public: true },
  t.option(userAvatar.rowType),//return row data if exist
  (ctx) => {
    const user = ctx.db.user.identity.find(ctx.sender);
    if(user){
      const user_avatar = ctx.db.userAvatar.userId.find(user.id);
      return user_avatar ?? undefined; 
    }
    return undefined;
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
  if (user) {
    ctx.db.user.identity.update({ ...user, online: true });
  } else {
    ctx.db.user.insert({
      identity: ctx.sender,
      id: 0n,
      name: undefined,
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
function validateName(name: string) {
  if (!name) {
    throw new SenderError('Names must not be empty');
  }
}
//-----------------------------------------------
// SET USER NAME
//-----------------------------------------------
export const set_name = spacetimedb.reducer({ name: t.string() }, (ctx, { name }) => {
  // console.info("Name: ",name);
  validateName(name);
  const user = ctx.db.user.identity.find(ctx.sender);
  console.log("[server] Set Name:", name);
  if (!user) {
    throw new SenderError('Cannot set name for unknown user');
  }
  ctx.db.user.identity.update({ ...user, name });
});

export const set_custom_status = spacetimedb.reducer({ text: t.string() }, (ctx, { text }) => {
  // console.info("Name: ",name);
  validateName(text);
  const user = ctx.db.user.identity.find(ctx.sender);
  console.log("[server] Set Name:", text);
  if (!user) {
    throw new SenderError('Cannot set name for unknown custom status');
  }
  ctx.db.user.identity.update({ ...user, custom_status:text });
});
//-----------------------------------------------
// USER CURRENT STATUS
//-----------------------------------------------
export const current_user = spacetimedb.view(
  { name: 'current_user', public: true },
  t.option(user.rowType), // return row data if exist
  (ctx) => {
    const _user = ctx.db.user.identity.find(ctx.sender);
    if(_user){
      console.log("user: ", _user);
      return _user;
    }
  return undefined;
});

//-----------------------------------------------
// SEND MESSAGE
//-----------------------------------------------
function validateMessage(text: string) {
  if (!text) {
    throw new SenderError('Messages must not be empty');
  }
}

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
//-----------------------------------------------
// SEND DIRECT MESSAGE
//-----------------------------------------------
export const send_direct_message = spacetimedb.reducer(
  {toId:t.string(), text: t.string() },
  (ctx, { toId, text }) => {
  validateMessage(text);
  console.info(`User ${ctx.sender}: ${text}`);

  ctx.db.directMessage.insert({
    id:0n,
    senderId: ctx.sender,
    recipientId: ctx.sender,
    content:text,
    status:undefined,
    readAt:undefined,
    createdAt: ctx.timestamp,
  });
});

// get direct message
// need to be private not public
export const my_direct_message = spacetimedb.view(
  {name:'my_direct_message', public:true },
  t.array(directMessage.rowType),
  (ctx) => {
    const received = Array.from(
      ctx.db.directMessage.recipientId.filter(ctx.sender)
    )
    return received ?? [];
});

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

// need to check for admin before delete checks.
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

// need to delete group chat messages

// group chat id message
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
// get user id that current group chat messages.
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
// EXPORT DATABASE
//-----------------------------------------------
export default spacetimedb;
console.log("spacetime-app-chat");

