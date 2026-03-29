import { schema, table, t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';

export const set_blank = spacetimedb.reducer(
  { name: t.string() }, 
  (ctx, { name }) => {
  }
);
