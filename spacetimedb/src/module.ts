// server api module
// import { ScheduleAt } from 'spacetimedb';
// import { Random } from 'spacetimedb/server';
import { schema, table, t, SenderError  } from 'spacetimedb/server';

import { user, userAvatar } from './models/model_user';
import { groupChat, groupChatConfig, groupChatMember, groupChatMessage } from './models/model_group_chat';
import { directMessage, directMessageConfig } from './models/model_direct_message';
import { generateRandomString } from './helper';
import { messageEvent } from './models/model_event';
import { contact } from './models/model_contact';
import { sessions } from './models/model_session';

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
  sessions,
  userAvatar,
  contact,
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

  // ctx.connectionId is guaranteed to be defined
  const connId = ctx.connectionId!;
  
  // Initialize client session
  ctx.db.sessions.insert({
    connection_id: connId,
    identity: ctx.sender,
    connected_at: ctx.timestamp
  });


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

  // ctx.connectionId is guaranteed to be defined
  const connId = ctx.connectionId!;
  // Clean up client session
  ctx.db.sessions.connection_id.delete(connId);
});

//-----------------------------------------------
// EXPORT DATABASE
//-----------------------------------------------
export default spacetimedb;
console.log("spacetime-app-chat");

