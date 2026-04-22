


// import { DbConnection, tables } from '../module_bindings';
import { Modal } from "vanjs-ui";
import van from "vanjs-core";
import { userAvatarUrl, userName, userStatus } from "../../context";

const { div, input, textarea, button, span, img, label, p } = van.tags;

//-----------------------------------------------
// Modal
//-----------------------------------------------
export function editUserNamePanel(){
  const closed = van.state(false)
  const editUserName = van.state("");
  function applyEditName(){
    try {
      // console.log("Set Name:", editUserName.val);
      conn.reducers.setName({name:editUserName.val});
      closed.val = true;
    } catch (error) {
      console.log("edit name error!");
    }
  }
  return Modal({closed},
    p("Change user name!"),
    div({style: "display: flex; justify-content: center;"},
      input({value:editUserName,oninput:e=>editUserName.val=e.target.value}),
      button({onclick: () => applyEditName()}, " Okay "),
      button({onclick: () => closed.val = true}, "Cancel"),
    ),
  )
}


function editStatusPanel(){
  const closed = van.state(false)
  const editCustomStatus = van.state("");
  function applyEditName(){
    try {
      // console.log("Set Name:", editCustomStatus.val);
      console.log(conn.reducers);
      conn.reducers.setCustomStatus({text:editCustomStatus.val});
      closed.val = true;
    } catch (error) {
      console.log("edit name error!");
    }
  }
  
  return Modal({closed},
    p("Edit status!"),
    div({style: "display: flex; justify-content: center;"},
      input({value:editCustomStatus,oninput:e=>editCustomStatus.val=e.target.value}),
      button({onclick: () => applyEditName()}, " Okay "),
      button({onclick: () => closed.val = true}, "Cancel"),
    ),
  )
}
// van.add(document.body, editStatusPanel());

function editAvatarImagePanel(){
  const closed = van.state(false)
  const el_file = input({type:'file'})
  async function upload_file(event){
    // console.log(event);
    const file = el_file.files[0];
    // console.log(file);
    // console.log(file.type);
    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);
    // console.log(arrayBuffer);
    try {
      conn.reducers.uploadAvatar({
        userId:BigInt(1),
        mimeType:file.type,
        data:fileBytes
      });  
      console.log("pass!");
      closed.val = true;
    } catch (error) {
      console.log("upload failed!");
    }
  }

  return Modal({closed},
    p("Edit Upload Image 48x48!"),
    div({style: "display: flex; justify-content: center;"},
      el_file,
      button({onclick:upload_file}, "Upload File"),
      button({onclick: () => closed.val = true}, "Cancel"),
    ),
  )
}

//-----------------------------------------------
// 
//-----------------------------------------------
export function UserPanel() {
  // You would normally pull these from state / props / WebRTC / server
  // const username = "Guest";           // ← replace with real data
  // const avatarUrl = "";  // ← real avatar
  const isMuted   = van.state(false);
  const isDeafened = van.state(false);

  function toggle_mic(){
    isMuted.val = !isMuted.val
    console.log(isMuted.val);
  }

  function editName(){
    console.log("edit name???");
    van.add(document.body, editUserNamePanel());
  }

  function editStatus(){
    console.log("edit Status???");
    van.add(document.body, editStatusPanel());
  }

  function editAvatarImage(){
    van.add(document.body, editAvatarImagePanel());
  }

  const displayName = van.derive(()=>{
    // console.log("userName.val:", userName.val);
    return userName.val.slice(0, 16);
  });

  return div(
    {
      style: `
        position: fixed;
        bottom: 8px;
        left: 8px;
        width: 280px;
        height: 60px;
        background: #2f3136;          /* Discord dark gray */
        border-radius: 2px;
        color: #dcddde;
        font-family: 'gg sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding: 0 4px;
        user-select: none;
        z-index: 9999;
      `
    },
    // Avatar + name section (left)
    div(
      { style: "display:flex; align-items:center; gap:2px; flex:1;" },
      img({
        onclick:editAvatarImage,
        // src: userAvatarUrl.val,
        src: userAvatarUrl,
        width: "40",
        height: "40",
        style: "border-radius:50%; object-fit:cover;"
      }),
      div(
        { style: "display:flex; flex-direction:column;" },
        label({onclick:()=>editName(),style: "font-weight:600;" }, displayName),
        // label({onclick:()=>editStatus(), style: "font-size:12px; color:#b9bbbe;" }, "idle msg")
        label({onclick:()=>editStatus(), style: "font-size:12px; color:#b9bbbe;" }, userStatus)
      )
    ),
    // Controls (right) - mic, headset, settings
    div(
      { style: "display:flex; gap:2px;" },
      button(
        {
          // onclick: () => isMuted.val = !isMuted.val,
          onclick: () => toggle_mic(),
          style: `
            background:none;
            border:none;
            color:${()=>isMuted.val ? "#f23f42" : "#b9bbbe"};
            font-size:20px;
            cursor:pointer;
            padding:4px;
          `
        },
        ()=> isMuted.val ? "🔇" : "🎤"   // or use real icons/SVGs
      ),
      button(
        {
          onclick: () => isDeafened.val = !isDeafened.val,
          style: `
            background:none;
            border:none;
            color:${()=> isDeafened.val ? "#f23f42" : "#b9bbbe"};
            font-size:20px;
            cursor:pointer;
            padding:4px;
          `
        },
        ()=> isDeafened.val ? "🙉" : "🎧"
      ),
      button(
        {
          style: `
            background:none;
            border:none;
            color:#b9bbbe;
            font-size:20px;
            cursor:pointer;
            padding:4px;
          `
        },
        "⚙️"   // settings gear
      )
    )
  );
}
