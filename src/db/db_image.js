// 

import { stateConn, userAvatarUrl, userId, userName, userStatus } from "../context";
import { tables } from "../module_bindings";

//-----------------------------------------------
// CREATE IMAGE AND LOAD TMP URL OBJECT
//-----------------------------------------------
function displayAvatar(bytes, mimeType) {
  // 1. Create a Blob from the Uint8Array and the stored MIME type
  const blob = new Blob([bytes], { type: mimeType });
  // 2. Generate a temporary URL for the browser
  const imageUrl = URL.createObjectURL(blob);
  // 3. Set it as an <img> source
  // document.getElementById('avatarDisplay').src = imageUrl;
  // avatar_image.src = imageUrl;
  // console.log(imageUrl);
  userAvatarUrl.val = imageUrl;
}
//-----------------------------------------------
// LOAD AVATAR IMAGE
//-----------------------------------------------
export function setupDataBaseAvatar(){
  // user avatar image listen
  const conn = stateConn.val;
  conn
    .subscriptionBuilder()
    .subscribe(tables.user_current_avatar);
  // current user avatar image
  conn.db.user_current_avatar.onInsert((ctx, row)=>{
    // console.log(row);
    displayAvatar(row.data, row.type);
  })
}