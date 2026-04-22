
import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';

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
    const user = ctx.db.users.identity.find(ctx.sender);
    if(user){
      const user_avatar = ctx.db.userAvatars.userId.find(user.id);
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