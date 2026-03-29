import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { user, userAvatar } from '../models/model_user';
import { validateName } from '../helper';

//-----------------------------------------------
// SET USER NAME
//-----------------------------------------------
export const set_name = spacetimedb.reducer({ name: t.string() }, (ctx, { name }) => {
  // console.info("Name: ",name);
  validateName(name);
  const user = ctx.db.user.identity.find(ctx.sender);
  console.log("[server] Set Name:", name);
  console.log(user);
  if (!user) {
    throw new SenderError('Cannot set name for unknown user');
  }
  
  ctx.db.user.identity.update({ ...user, name });
});
//-----------------------------------------------
// 
//-----------------------------------------------
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
// test
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
  if(file){
    return {data:file?.data, type:file?.type};
  }else{
    return { data: undefined, type: "" };
  }
})

