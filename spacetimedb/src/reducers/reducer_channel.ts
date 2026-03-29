import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
//-----------------------------------------------
// TYPE CHANNEL
//-----------------------------------------------
export const add_channel = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {

  }
);

export const update_channel = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {
    
  }
);

export const delete_channel = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {
    
  }
);

//-----------------------------------------------
// TEXT CHANNEL
//-----------------------------------------------
export const add_text_channel = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {

  }
);

export const update_text_channel = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {

  }
);

export const delete_text_channel = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {

  }
);
//-----------------------------------------------
// 
//-----------------------------------------------
