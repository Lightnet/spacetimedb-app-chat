// server api module
// import { ScheduleAt } from 'spacetimedb';
// import { Random } from 'spacetimedb/server';
import { schema, table, t, SenderError  } from 'spacetimedb/server';

import { users } from './tables/table_user';
import { groupChats, groupChatConfigs, groupChatMembers, groupChatMessages } from './tables/table_group_chat';
import { directMessages, directMessageConfigs, directConversations } from './tables/table_direct_message';
// import { generateRandomString } from './helper';
import { messageEvent } from './tables/table_event';
import { contacts } from './tables/table_contact';
import { sessions } from './tables/table_session';
import { userAvatars } from './tables/table_image';
import { messages } from './tables/table_message';

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
  users,
  sessions,
  userAvatars,
  contacts,
  messages,
  //=============================================
  directMessages,
  directConversations,
  directMessageConfigs,
  //=============================================
  groupChats,
  groupChatConfigs,
  groupChatMembers,
  groupChatMessages,
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
  const user = ctx.db.users.identity.find(ctx.sender);
  // console.log("ctx: ",ctx);
  // console.log("connectionId: ",ctx.connectionId); //socket id ???
  // console.log("connectionId: ",ctx.connectionId?.toHexString());
  console.log("SENDER: ",ctx.sender);
  console.log("SENDER: ",ctx.sender.toHexString());
  console.log(ctx.random())
  if (user) {
    ctx.db.users.userId.update({ 
      ...user, 
      online: true,
    });
  } else {
    // let generateName = generateRandomString(ctx,12);
    let generateName = String(ctx.newUuidV7()).replaceAll("-","");
    ctx.db.users.insert({
      identity: ctx.sender,
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
  const user = ctx.db.users.identity.find(ctx.sender);
  if (user) {
    ctx.db.users.userId.update({ 
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

