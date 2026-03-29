// user table views

import { t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { user, userAvatar } from '../models/model_user';

//-----------------------------------------------
// USER CURRENT STATUS
//-----------------------------------------------
export const current_blank = spacetimedb.view(
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