import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
// import { user, userAvatar } from '../models/model_user';
// import { validateName } from '../helper';

//-----------------------------------------------
// SET USER NAME
//-----------------------------------------------
export const set_name = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {
    // console.info("Name: ",name);
    // validateName(name);
    // const user = ctx.db.user.identity.find(ctx.sender);
    // console.log("[server] Set Name:", name);
    // console.log(user);
    // if (!user) {
    //   throw new SenderError('Cannot set name for unknown user');
    // }
    // ctx.db.user.identity.update({ ...user, name });
  }
);
