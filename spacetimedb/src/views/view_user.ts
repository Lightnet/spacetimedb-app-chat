// user table views

import { t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { users } from '../tables/table_user';
import { userAvatars } from '../tables/table_image';

//-----------------------------------------------
// GET CURRENT AVATAR IMAGE VIEW
//-----------------------------------------------
// https://spacetimedb.com/docs/functions/views
export const user_current_avatar = spacetimedb.view(
  { name: 'user_current_avatar', public: true },
  t.option(userAvatars.rowType),//return row data if exist
  (ctx) => {
    const user = ctx.db.users.identity.find(ctx.sender);
    if(user){
      const user_avatar = ctx.db.userAvatars.userId.find(user.id);
      return user_avatar ?? undefined; 
    }
    return undefined;
});

//-----------------------------------------------
// USER CURRENT STATUS
//-----------------------------------------------
export const current_user = spacetimedb.view(
  { name: 'current_user', public: true },
  t.option(users.rowType), // return row data if exist
  (ctx) => {
    const _user = ctx.db.users.identity.find(ctx.sender);
    if(_user){
      console.log("user: ", _user);
      return _user;
    }
  return undefined;
});