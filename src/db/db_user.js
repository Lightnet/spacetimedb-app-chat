// 

import { dbUsers, stateConn, userId, userName, userStatus } from "../context";
import { tables } from "../module_bindings";

function addOrUpdateUser(ent) {
  if (!ent || !ent.id) return;
  const newMap = new Map(dbUsers.val);           // create copy
  newMap.set(ent.id, ent);
  dbUsers.val = newMap;                  // assign new Map → triggers update
}

function deleteUser(id) {
  if (!id) return;
  // Create new Map without the item
  const newMap = new Map(dbUsers.val);
  newMap.delete(id);
  // Update the state (this is what makes VanJS detect the change)
  dbUsers.val = newMap;
}

export function setUpDBUser(){
  const conn = stateConn.val;
  conn
    .subscriptionBuilder()
    .onError((ctx, error) => {
      console.error(`Subscription failed: ${error}`);
    })
    .subscribe(tables.current_user);

  conn.db.current_user.onInsert((ctx, row)=>{
    console.log('insert current user row', row);
    if(row.identity.toHexString() == conn.identity.toHexString()){
      // console.log("found current ID:", conn.identity.toHexString());
      // console.log("Name: ",row.name)
      userName.val = row.name ?? 'Uknown';
      userStatus.val = row.customStatus ?? 'Idle';
      userId.val = row.userId;
      console.log("row.userId: ", row.userId);
    }
    addOrUpdateUser(row);
  });

  conn.db.current_user.onUpdate((ctx, oldRow, newRow)=>{
    // console.log('insert current user row');
    // console.log(newRow);
    if(newRow.identity.toHexString() == conn.identity.toHexString()){
      // console.log("found current ID:", conn.identity.toHexString());
      // console.log("Name: ",newRow.name)
      userName.val = newRow.name ?? 'Uknown';
      userStatus.val = newRow.customStatus ?? 'Idle';
    }
    addOrUpdateUser(newRow);
  });

  conn.db.current_user.onDelete((ctx, row)=>{
    deleteUser(row.id)
  });
}