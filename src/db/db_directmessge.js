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

function deleteDC(row) {
  if (!row || !row.id) return;
  
  const currentMap = dbDirectConversations.val;
  const existingEntry = currentMap.get(row.id);

  // If it's already gone from our local state, nothing to do
  if (!existingEntry) return;

  // COMPARE TIMESTAMPS
  // If the 'existingEntry' has a newer timestamp than the 'row' being deleted,
  // it means the Insert (the update) already happened. DO NOT DELETE.
  if (existingEntry.lastMessageAt.toMillis() > row.lastMessageAt.toMillis()) {
    console.log("Ignore Delete: Local state is newer than the delete event.");
    return;
  }

  // If they are the same, it means the conversation was actually removed 
  // (e.g. filtered out of the view entirely), so we delete it.
  const newMap = new Map(currentMap);
  newMap.delete(row.id);
  dbDirectConversations.val = newMap;
}

export function setupDBDirectMessage(){
  const conn = stateConn.val;
  conn
    .subscriptionBuilder()
    //get userid from sender
    // .subscribe(tables.my_conversations.where(r=>r.userB.eq(userId.val)));
    .subscribe(tables.my_direct_conversations);

  //note this get delete while update must be the view call for delete
  // conn.db.my_conversations.onDelete((ctx, row)=>{
  //   console.log("last conversations Delete...", row);
  //   deleteDC(row);
  // });

  conn.db.my_direct_conversations.onInsert((ctx, row)=>{
    console.log("last conversations Added...", row);
    addOrUpdateDC(row);
  });

  // no update? since view only need read doc.
  // conn.db.my_conversations.onUpdate((ctx, oldRow, newRow)=>{
  //   console.log("last conversations update...", newRow);
  //   addOrUpdateDC(newRow);
  // });
}

