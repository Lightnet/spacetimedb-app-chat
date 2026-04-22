import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { users } from '../tables/table_user';
import { validateName } from '../helper';

//-----------------------------------------------
// SET USER NAME
//-----------------------------------------------
export const set_name = spacetimedb.reducer({ name: t.string() }, (ctx, { name }) => {
  // console.info("Name: ",name);
  validateName(name);
  const user = ctx.db.users.identity.find(ctx.sender);
  console.log("[server] Set Name:", name);
  console.log(user);
  if (!user) {
    throw new SenderError('Cannot set name for unknown user');
  }
  
  ctx.db.users.identity.update({ ...user, name });
});
//-----------------------------------------------
// 
//-----------------------------------------------
export const set_custom_status = spacetimedb.reducer({ text: t.string() }, (ctx, { text }) => {
  // console.info("Name: ",name);
  validateName(text);
  const user = ctx.db.users.identity.find(ctx.sender);
  console.log("[server] Set Name:", text);
  if (!user) {
    throw new SenderError('Cannot set name for unknown custom status');
  }
  ctx.db.users.identity.update({ ...user, custom_status:text });
});
//-----------------------------------------------
// UPLOAD AVATAR IMAGE
//-----------------------------------------------
export const upload_avatar = spacetimedb.reducer({
  userId: t.u64(),
  mimeType: t.string(),
  data: t.array(t.u8()),
}, (ctx, { userId, mimeType, data }) => {

  const user = ctx.db.users.identity.find(ctx.sender);
  // console.log(user);

  if(user){
    // console.log("user: ", user);
    // console.log("mimeType: ", mimeType);
    // console.log("data: ", data);
    // Delete existing avatar if present
    ctx.db.userAvatars.userId.delete(user.id);

    // Insert new avatar
    ctx.db.userAvatars.insert({
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
  console.log("ctx.db.userAvatar.count(): ", ctx.db.userAvatars.count());
  const user = ctx.db.users.identity.find(ctx.sender);

  if(user){
    // console.log("user id exist:", ctx.db.userAvatar.userId.find(user.id));
    for (const row of ctx.db.userAvatars.iter()) {
      console.log("Found avatar for user:", row.userId);
      // Do something with row.data...
      // console.log(row );
    }
  }
});

