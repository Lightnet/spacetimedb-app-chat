//-----------------------------------------------
// 
//-----------------------------------------------

import { Modal } from "vanjs-ui";
import van from "vanjs-core";
import { stateConn, userAvatarUrl, userName, userStatus } from "../../context";

const { div, input, textarea, button, span, img, label, p, select, option, h3 } = van.tags;

//-----------------------------------------------
// MODAL EDIT USER NAME PANEL
//-----------------------------------------------
export function editUserNamePanel(){
  const closed = van.state(false)
  const editUserName = van.state("");
  function applyEditName(){
    try {
      const conn = stateConn.val;
      // console.log("Set Name:", editUserName.val);
      conn.reducers.setName({name:editUserName.val});
      closed.val = true;
    } catch (error) {
      console.log("edit name error!");
    }
  }

  return Modal({closed},
    div({style: `
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 1.5rem; 
      padding: 2rem; 
      background-color: #1e1e1e; 
      color: #ffffff;
      border-radius: 8px;
      font-family: sans-serif;
    `},
      p({style: `margin: 0; font-size: 1.2rem; font-weight: 500;`}, "Change User Name!"),
      
      input({
        value: editUserName,
        oninput: e => editUserName.val = e.target.value,
        style: `
          padding: 10px; 
          width: 100%; 
          background: #2d2d2d; 
          color: white; 
          border: 1px solid #444; 
          border-radius: 4px;
          outline: none;
        `
      }),

      // Button container - centered
      div({style: `display: flex; justify-content: center; gap: 12px; width: 100%;`},
        button({
          onclick: () => applyEditName(),
          style: `
            padding: 10px 24px; 
            background: #3d5afe; 
            color: white; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer;
            font-weight: bold;
          `
        }, "Okay"),
        
        button({
          onclick: () => closed.val = true,
          style: `
            padding: 10px 24px; 
            background: transparent; 
            color: #bbb; 
            border: 1px solid #444; 
            border-radius: 4px; 
            cursor: pointer;
          `
        }, "Cancel")
      )
    )
  )

  // end
}
// EDIT STATUS PANEL
function editStatusPanel(){
  const closed = van.state(false)
  const editCustomStatus = van.state("");
  function applyEditName(){
    try {
      const conn = stateConn.val;
      // console.log("Set Status:", editCustomStatus.val);
      console.log(conn.reducers);
      conn.reducers.setCustomStatus({text:editCustomStatus.val});
      closed.val = true;
    } catch (error) {
      console.log("edit name error!");
    }
  }
  
  return Modal({closed},
    div({style: `
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 1rem; 
      padding: 24px; 
      background-color: #1a1a1a; 
      color: #e0e0e0; 
      border-radius: 12px;
      min-width: 300px;
    `},
      // Title
      p({style: `margin: 0; font-size: 1.1rem; font-weight: 600; color: #fff;`}, "Edit Status!"),
      
      // Input - Full width with dark styling
      input({
        value: editCustomStatus,
        oninput: e => editCustomStatus.val = e.target.value,
        placeholder: "What's happening?",
        style: `
          width: 100%; 
          padding: 12px; 
          background: #2a2a2a; 
          color: white; 
          border: 1px solid #444; 
          border-radius: 6px;
          box-sizing: border-box;
        `
      }),

      // Button Row - Centered
      div({style: `display: flex; gap: 10px; justify-content: center; width: 100%;`},
        button({
          onclick: () => applyEditName(),
          style: `
            flex: 1;
            max-width: 100px;
            padding: 10px; 
            background: #007bff; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer;
            font-weight: bold;
          `
        }, "Okay"),
        
        button({
          onclick: () => closed.val = true,
          style: `
            flex: 1;
            max-width: 100px;
            padding: 10px; 
            background: #333; 
            color: #ccc; 
            border: 1px solid #444; 
            border-radius: 6px; 
            cursor: pointer;
          `
        }, "Cancel")
      )
    )
  )

  // end
}
// van.add(document.body, editStatusPanel());


function editAvatarImagePanel() {
  const closed = van.state(false);
  const previewSrc = van.state(""); // State for preview
  const el_file = input({
    type: 'file',
    accept: "image/*",
    style: "display: none;", // Hide the ugly default input
    onchange: (e) => {
      const file = e.target.files[0];
      if (file) previewSrc.val = URL.createObjectURL(file);
    }
  });

  async function upload_file() {
    const file = el_file.files[0];
    if (!file) return alert("Please select a file first!");
    
    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);
    try {
      const conn = stateConn.val;
      await conn.reducers.uploadAvatar({
        userId: BigInt(1),
        mimeType: file.type,
        data: fileBytes
      });
      closed.val = true;
    } catch (error) {
      console.error("upload failed!", error.message);
    }
  }

  return Modal({closed},
    div({style: `
      display: flex; flex-direction: column; align-items: center; 
      gap: 1.2rem; padding: 2rem; background: #1a1a1a; 
      color: white; border-radius: 12px; min-width: 280px;
    `},
      p({style: "margin: 0; font-weight: bold;"}, "Update Avatar"),
      
      // Image Preview Circle
      img({
        src: previewSrc, 
        style: `
          width: 80px; height: 80px;
          background: #333; border: 2px solid #444;
        `,
        // Fallback placeholder if no image selected
        onerror: e => e.target.src = userAvatarUrl.val ?? ""
      }),
      
      p({style: "font-size: 0.8rem; color: #888; margin: 0;"}, "Recommended: 48x48px"),

      // Hidden file input triggered by this button
      button({
        onclick: () => el_file.click(),
        style: "padding: 8px 16px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; cursor: pointer;"
      }, "Select Image"),

      el_file, // Hidden element

      // Action Buttons
      div({style: "display: flex; gap: 10px; justify-content: center; width: 100%;"},
        button({
          onclick: upload_file,
          style: "flex: 1; padding: 10px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;"
        }, "Upload"),
        button({
          onclick: () => closed.val = true,
          style: "flex: 1; padding: 10px; background: transparent; color: #888; border: 1px solid #444; border-radius: 6px; cursor: pointer;"
        }, "Cancel")
      )
    )
  )
}


function userSettingsPanel() {
  const closed = van.state(false);

  // Dark Theme Palette
  const colors = {
    bg: "#121212",      // Deep gray background
    surface: "#1E1E1E", // Slightly lighter surface for rows
    text: "#E0E0E0",    // Soft white text
    accent: "#BB86FC",  // Desaturated purple for buttons/accents
    border: "#333333"
  };

  const Row = (...children) => div(
    {
      style: `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        padding: 8px 12px;
        background: ${colors.surface};
        border-radius: 6px;
        gap: 1rem;
      `
    },
    ...children
  );

  return Modal({ closed },
    div(
      { 
        style: `
          padding: 1.5rem; 
          min-width: 320px; 
          background: ${colors.bg}; 
          color: ${colors.text};
          font-family: system-ui, sans-serif;
          border-radius: 8px;
        ` 
      },
      h3({ style: "margin-top: 0; margin-bottom: 1.5rem; color: #fff;" }, "User Settings"),

      Row(
        label("Status:"),
        select(
          { style: `background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border}; padding: 4px;` },
          option("Online"),
          option("Idle"),
          option("Offline")
        )
      ),

      Row(
        label("Theme:"),
        span({ style: `color: ${colors.accent}; font-weight: bold;` }, "Dark")
      ),

      Row(
        label("Network Status:"),
        button(
          { 
            onclick: () => console.log("Toggle network"),
            style: `background: ${colors.accent}; color: #000; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: 500;`
          }, 
          "Toggle ?"
        )
      ),

      div(
        { style: "display: flex; justify-content: flex-end; margin-top: 2rem;" },
        button(
          { 
            onclick: () => (closed.val = true),
            style: `background: transparent; color: ${colors.text}; border: 1px solid ${colors.border}; padding: 8px 16px; border-radius: 4px; cursor: pointer;`
          }, 
          "Close"
        )
      )
    )
  );
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

  function onClickSettings(){
    console.log("settings...");
    van.add(document.body, userSettingsPanel());
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
          onclick: () => onClickSettings(),
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
