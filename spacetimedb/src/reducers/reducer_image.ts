import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';

// export const set_blank = spacetimedb.reducer(
//   { name: t.string() }, 
//   (ctx, { name }) => {
//     // 
//   }
// );
//-----------------------------------------------
// UPLOAD AVATAR IMAGE
//-----------------------------------------------
export const upload_avatar = spacetimedb.reducer({
  mimeType: t.string(),
  data: t.array(t.u8()),
}, (ctx, { mimeType, data }) => {
  console.log("image upload...")
  const user = ctx.db.users.identity.find(ctx.sender);
  // console.log(user);

  if(user){
    // console.log("user: ", user);
    // console.log("mimeType: ", mimeType);
    // console.log("data: ", data);
    // Delete existing avatar if present
    ctx.db.userAvatars.userId.delete(user.userId);

    // Insert new avatar
    ctx.db.userAvatars.insert({
      userId:user.userId,
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
