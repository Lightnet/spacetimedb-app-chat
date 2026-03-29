// user table views

import { t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { contact } from '../models/model_contact';

//-----------------------------------------------
// USER CURRENT STATUS
//-----------------------------------------------
export const view_contact = spacetimedb.view(
  { name: 'view_contact', public: true },
  t.array(contact.rowType), // return row data if exist
  (ctx) => {
    const _user = ctx.db.user.identity.find(ctx.sender);
    if(_user){
        return Array.from(ctx.db.contact.identity.filter(_user.userId)) ?? [];
    }
    return [];
});