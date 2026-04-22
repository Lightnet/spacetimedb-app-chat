// 

import { dbContacts, stateConn } from "../context";
import { tables } from "../module_bindings";
import van from "vanjs-core";

const { div, input, textarea, button, span, img, label, p } = van.tags;

function addOrUpdateContact(ent) {
  if (!ent || !ent.id) return;
  const newMap = new Map(dbContacts.val);           // create copy
  newMap.set(ent.id, ent);
  dbContacts.val = newMap;                  // assign new Map → triggers update
}

function deleteContact(id) {
  if (!id) return;
  // Create new Map without the item
  const newMap = new Map(dbContacts.val);
  newMap.delete(id);
  // Update the state (this is what makes VanJS detect the change)
  dbContacts.val = newMap;
}

export function setupDBContact(){
  const conn = stateConn.val;
  conn
    .subscriptionBuilder()
    .onError((ctx, error) => {
      console.error(`Subscription failed: ${error}`);
    })
    // .onApplied((ctx)=>{
      // ctx.
      // console.log(ctx);
    // })
    .subscribe(tables.view_contact);

  conn.db.view_contact.onInsert((ctx, row)=>{
    console.log("Contact Added...", row);
    addOrUpdateContact(row);
  });

  conn.db.view_contact.onDelete((ctx, row)=>{
    console.log("Contact Delete...", row);
    deleteContact(row.id);
  });
}

