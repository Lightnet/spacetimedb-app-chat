// server api module
import { ScheduleAt } from 'spacetimedb';
import { schema, table, t, SenderError  } from 'spacetimedb/server';

// console.log("db test");

const user = table(
  { 
    name: 'user', 
    public: true,
  },
  {
    identity: t.identity().primaryKey(),
    id:t.u64().autoInc(),
    name: t.string().optional(),
    online: t.bool(),
  }
);

const userAvatar = table(
  { name: 'user_avatar', public: true },
  {
    userId: t.u64().primaryKey(),
    mimeType: t.string(),
    data: t.array(t.u8()),  // Binary data stored inline
    uploadedAt: t.timestamp(),
  }
);

const message = table(
  { name: 'message', public: true },
  {
    sender: t.identity(),
    sent: t.timestamp(),
    text: t.string(),
  }
);

const spacetimedb = schema({
  user,
  userAvatar,
  message,
});


export const upload_avatar = spacetimedb.reducer({
  userId: t.u64(),
  mimeType: t.string(),
  data: t.array(t.u8()),
}, (ctx, { userId, mimeType, data }) => {

  const user = ctx.db.user.identity.find(ctx.sender);
  console.log(user);

  if(user){
    console.log("user: ", user);
    console.log("mimeType: ", mimeType);
    console.log("data: ", data);
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

export const user_avatar_count = spacetimedb.reducer({},(ctx, args ) => {
  console.log("ctx.db.userAvatar.count(): ", ctx.db.userAvatar.count());
  const user = ctx.db.user.identity.find(ctx.sender);

  if(user){
    console.log("user id exist:", ctx.db.userAvatar.userId.find(user.id));
    for (const row of ctx.db.userAvatar.iter()) {
      console.log("Found avatar for user:", row.userId);
      // Do something with row.data...
      // console.log(row );
    }
  }
});

// testing get image
export const get_avatar = spacetimedb.procedure(
  { id:t.u64() }, 
  // t.object('Name', { data: t.array(t.u8()),type:t.string()  }),
  // t.object('AvatarResult', { 
  t.object('Name', { 
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
      console.log("user id exist:", user_avatar?.userId);
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
  console.log("test");
  if(file){
    return {data:file?.data, type:file?.type};
  }else{
    return { data: undefined, type: "" };
  }
  
  // return {data:"ss",type:"test"}
  // return {data:data,type:type}
})
// https://spacetimedb.com/docs/functions/views
export const user_current_avatar = spacetimedb.view(
  { name: 'user_current_avatar', public: true },
  t.option(userAvatar.rowType),
  (ctx) => {
    const user = ctx.db.user.identity.find(ctx.sender);
    if(user){
      const user_avatar = ctx.db.userAvatar.userId.find(user.id);
      if(user_avatar){
        return user_avatar; 
      }
    }
    return undefined;
});


export const init = spacetimedb.init(_ctx => {
  console.log("===============INIT SPACETIMEDB APP NAME:::=========");
});

export const onConnect = spacetimedb.clientConnected(ctx => {
  const user = ctx.db.user.identity.find(ctx.sender);
  console.log("SENDER: ",ctx.sender);
  if (user) {
    ctx.db.user.identity.update({ ...user, online: true });
  } else {
    ctx.db.user.insert({
      identity: ctx.sender,
      id:0n,
      name: undefined,
      online: true,
    });
  }
});

export const onDisconnect = spacetimedb.clientDisconnected(ctx => {
  const user = ctx.db.user.identity.find(ctx.sender);
  if (user) {
    ctx.db.user.identity.update({ ...user, online: false });
  } else {
    console.warn(
      `Disconnect event for unknown user with identity ${ctx.sender}`
    );
  }
});

function validateName(name: string) {
  if (!name) {
    throw new SenderError('Names must not be empty');
  }
}

export const set_name = spacetimedb.reducer({ name: t.string() }, (ctx, { name }) => {
  // console.info("Name: ",name);
  validateName(name);
  const user = ctx.db.user.identity.find(ctx.sender);
  if (!user) {
    throw new SenderError('Cannot set name for unknown user');
  }
  ctx.db.user.identity.update({ ...user, name });
});

function validateMessage(text: string) {
  if (!text) {
    throw new SenderError('Messages must not be empty');
  }
}

export const send_message = spacetimedb.reducer({ text: t.string() }, (ctx, { text }) => {
  validateMessage(text);
  console.info(`User ${ctx.sender}: ${text}`);
  ctx.db.message.insert({
    sender: ctx.sender,
    text,
    sent: ctx.timestamp,
  });
});

export default spacetimedb;
console.log("spacetime-app-chat");
