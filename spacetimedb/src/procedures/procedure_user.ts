
import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';

//-----------------------------------------------
// GET USER NAME BY ID
//-----------------------------------------------
export const get_user_name_id = spacetimedb.procedure(
  { id:t.string() },
  t.option(t.string()),
  (ctx,{id})=>{
    return ctx.withTx(tx => {
      const user = tx.db.users.userId.find(id);
      return user?.name ?? undefined;
    })
});

