// 

import { dbDirectMessages, stateConn } from "../context";
import { tables } from "../module_bindings";
import van from "vanjs-core";

const { div, input, textarea, button, span, img, label, p } = van.tags;

function addOrUpdateDM(ent) {
  if (!ent || !ent.id) return;
  const newMap = new Map(dbDirectMessages.val);           // create copy
  newMap.set(ent.id, ent);
  dbDirectMessages.val = newMap;                  // assign new Map → triggers update
}

function deleteDM(id) {
  if (!id) return;
  // Create new Map without the item
  const newMap = new Map(dbDirectMessages.val);
  newMap.delete(id);
  // Update the state (this is what makes VanJS detect the change)
  dbDirectMessages.val = newMap;
}

export function setupDBDirectMessage(){
  const conn = stateConn.val;
  conn
    .subscriptionBuilder()
    .subscribe(tables.my_direct_messages);

  conn.db.my_direct_messages.onInsert((ctx, row)=>{
    console.log("Contact Added...", row);
    addOrUpdateContact(row);
  });

  conn.db.my_direct_messages.onDelete((ctx, row)=>{
    console.log("Contact Delete...", row);
    deleteContact(row.id);
  });
}

