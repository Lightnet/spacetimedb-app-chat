// 

import { dbDirectConversations, stateConn, userId } from "../context";
import { tables } from "../module_bindings";
import van from "vanjs-core";

const { div, input, textarea, button, span, img, label, p } = van.tags;

function addOrUpdateDC(ent) {
  if (!ent || !ent.id) return;
  const newMap = new Map(dbDirectConversations.val);           // create copy
  newMap.set(ent.id, ent);
  dbDirectConversations.val = newMap;                  // assign new Map → triggers update
}

function deleteDC(id) {
  if (!id) return;
  // Create new Map without the item
  const newMap = new Map(dbDirectConversations.val);
  newMap.delete(id);
  // Update the state (this is what makes VanJS detect the change)
  dbDirectConversations.val = newMap;
}

export function setupDBDirectMessage(){
  const conn = stateConn.val;
  conn
    .subscriptionBuilder()
    //get userid from sender
    // .subscribe(tables.my_conversations.where(r=>r.userB.eq(userId.val)));
    .subscribe(tables.my_conversations);

  conn.db.my_conversations.onInsert((ctx, row)=>{
    console.log("last conversations Added...", row);
    addOrUpdateDC(row);
  });

  conn.db.my_conversations.onUpdate((ctx, oldRow, newRow)=>{
    console.log("last conversations Added...", newRow);
    addOrUpdateDC(newRow);
  });

  //note this get delete while update must be the view call for delete
  conn.db.my_conversations.onDelete((ctx, row)=>{
    console.log("last conversations Delete...", row);
    // deleteDC(row.id);
  });
}

