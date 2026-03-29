import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';

//-----------------------------------------------
// 
//-----------------------------------------------
export const add_board = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {
    // 
  }
);
//-----------------------------------------------
// 
//-----------------------------------------------
export const update_board = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {
    // 
  }
);
//-----------------------------------------------
// 
//-----------------------------------------------
export const delete_board = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {
    // 
  }
);