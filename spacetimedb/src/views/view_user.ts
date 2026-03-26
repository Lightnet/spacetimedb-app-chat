// user table views

import { t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { user, userAvatar } from '../models/model_user';

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