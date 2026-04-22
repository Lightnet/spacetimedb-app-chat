// user table views

import { t, SenderError  } from 'spacetimedb/server';
import spacetimedb from '../module';
import { contacts } from '../tables/table_contact';

//-----------------------------------------------
// USER CURRENT STATUS
//-----------------------------------------------
export const view_contacts = spacetimedb.view(
  { name: 'view_contacts', public: true },
  t.array(contacts.rowType), // return row data if exist
  (ctx) => {
    const _user = ctx.db.users.identity.find(ctx.sender);
    if(_user){
        return Array.from(ctx.db.contacts.identity.filter(_user.userId)) ?? [];
    }
    return [];
});