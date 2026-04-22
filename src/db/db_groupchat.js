import { dbGroupChats, stateConn } from "../context";
import { tables } from "../module_bindings";

function addOrUpdateGroupChat(ent) {
  if (!ent || !ent.id) return;
  const currentMap = dbGroupChats.val;        // get current
  const newMap = new Map(currentMap);           // create copy
  newMap.set(ent.id, ent);
  dbGroupChats.val = newMap;                  // assign new Map → triggers update
}

function deleteGroupChat(id) {
  if (!id) return;
  // Create new Map without the item
  const newMap = new Map(dbGroupChats.val);
  newMap.delete(id);
  // Update the state (this is what makes VanJS detect the change)
  dbGroupChats.val = newMap;
}

export function setupDBGroupChat(){
  const conn = stateConn.val;
  conn
    .subscriptionBuilder()
    .subscribe(tables.groupChats);

  conn.db.groupChats.onInsert((ctx, row)=>{
    // console.log("Group Chat", row);
    // displayAvatar(row.data, row.type);
    addOrUpdateGroupChat(row)
  })

  conn.db.groupChats.onDelete((ctx, row)=>{
    // console.log("Delete Group Chat");
    // console.log(row);
    // displayAvatar(row.data, row.type);
    deleteGroupChat(row.id)
  });
}