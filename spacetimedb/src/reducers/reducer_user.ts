import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
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
  
  ctx.db.users.userId.update({ ...user, name });
});
//-----------------------------------------------
// 
//-----------------------------------------------
export const set_custom_status = spacetimedb.reducer({ text: t.option(t.string()) }, (ctx, { text }) => {
  // console.info("Name: ",name);
  // validateName(text);
  const user = ctx.db.users.identity.find(ctx.sender);
  console.log("[server] Set Name:", text);
  if (!user) {
    throw new SenderError('Cannot set name for unknown custom status');
  }


  ctx.db.users.userId.update({ ...user, custom_status:text });
});

