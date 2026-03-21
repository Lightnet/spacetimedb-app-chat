// 
// 
// 
import { DbConnection, tables } from './module_bindings';
import van from "vanjs-core";
import { networkStatus, userIdentity, userName, userStatus, userAvatarUrl } from './context.js';
import { Modal } from "vanjs-ui";


const { div, input, textarea, button, span, img, label, p } = van.tags;

const HOST = 'ws://localhost:3000';
const DB_NAME = 'spacetime-app-chat';
//-----------------------------------------------
//
//-----------------------------------------------

// const el_status = van.state('Offline');
// const username = van.state('Guest');

//-----------------------------------------------
//
//-----------------------------------------------
const conn = DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  .withToken(localStorage.getItem('auth_token') || undefined)
  .onConnect((conn, identity, token) => {
    networkStatus.val = 'Connected';
    console.log("identity: ", identity);
    console.log("identity: ", identity.toHexString());
    console.log("conn: ", conn);
    // filter from table update calls...
    userIdentity.val = identity;

    initDB();
  })
  .onDisconnect(() => {
    console.log('Disconnected from SpacetimeDB');
    networkStatus.val = 'Disconnected';
  })
  .onConnectError((_ctx, error) => {
    console.error('Connection error:', error);
    networkStatus.val = 'Connection error';
    // statusEl.textContent = 'Error: ' + error.message;
    // statusEl.style.color = 'red';
  })
  .build();

function initDB(){
  setUpDBUser();
  setupDataBaseAvatar();
}

function setUpDBUser(){
  conn
    .subscriptionBuilder()
    .onError((ctx, error) => {
      console.error(`Subscription failed: ${error}`);
    })
    .subscribe(tables.user);

  conn.db.user.onInsert((ctx, row)=>{
    console.log('insert user row');
    console.log(row);
    if(row.identity.toHexString() == conn.identity.toHexString()){
      // console.log("found current ID:", conn.identity.toHexString());
      console.log("Name: ",row.name)
      userName.val = row.name ?? 'Uknown';
    }
  });

  // user avatar image listen
  conn
    .subscriptionBuilder()
    .subscribe(tables.user_current_avatar);
  // current user avatar image
  conn.db.user_current_avatar.onInsert((ctx, row)=>{
    console.log(row);
    // displayAvatar(row.data, row.type);
  })
}


function displayAvatar(bytes, mimeType) {
  // 1. Create a Blob from the Uint8Array and the stored MIME type
  const blob = new Blob([bytes], { type: mimeType });
  
  // 2. Generate a temporary URL for the browser
  const imageUrl = URL.createObjectURL(blob);
  
  // 3. Set it as an <img> source
  // document.getElementById('avatarDisplay').src = imageUrl;
  // avatar_image.src = imageUrl;
  console.log(imageUrl);
  userAvatarUrl.val = imageUrl;
}

function setupDataBaseAvatar(){
  // user avatar image listen
  conn
    .subscriptionBuilder()
      .subscribe(tables.user_current_avatar);
  // current user avatar image
  conn.db.user_current_avatar.onInsert((ctx, row)=>{
    console.log(row);
    displayAvatar(row.data, row.type);
  })
}

//-----------------------------------------------
// 
//-----------------------------------------------
const Message = ({side, name, text}) => div(
  {class: () => `message ${side}`},
  name && span({class: "name"}, name),
  text
);
//-----------------------------------------------
// 
//-----------------------------------------------
function ChatWindow() {
  const messageInput = van.state("");

  const messages = van.state([
    // { side: "received", name: "Steam", text: "Welcome to the black edition chatroom." },
    // { side: "sent",     name: "You",   text: "yo, any drops today?" },
    // { side: "received", name: "Steam", text: "Soon™" },
  ]);

  function sendMessage() {
    const text = messageInput.val.trim();
    if (!text) return;

    // messages.val = [...messages.val, { side: "sent", name: "You", text }];
    messageInput.val = "";

    conn.reducers.sendMessage({
      text:text
    });


    // Fake reply
    // setTimeout(() => {
    //   const replies = ["Waiting...", "Soon™", "Check your inventory", "Working on it", "Nice", "..."];
    //   messages.val = [
    //     ...messages.val,
    //     { side: "received", name: "Steam", text: replies[Math.floor(Math.random() * replies.length)] }
    //   ];
    // }, 600 + Math.random() * 1400);
  }

  function setUpConnChat(){
    conn
      .subscriptionBuilder()
      .onError((ctx, error) => {
        console.error(`Subscription failed: ${error}`);
      })
      .subscribe(tables.message);

    // get message
    conn.db.message.onInsert((ctx, row)=>{
      // console.log(ctx)
      // console.log(ctx.identity)
      // console.log(ctx.db)
      // console.log("message row: ", row);
      let side = '';
      if(row.sender.toHexString() == userIdentity.val.toHexString()){
        // console.log("FOUND USER???");
        side = "sent";
      }

      messages.val = [...messages.val, { side: side, name: "You", text:row.text }];
    });
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  //scroll
  van.derive(()=>{
    messages.val;
    setTimeout(()=>{
      const container = document.getElementById('messages');
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },50);
  });

  // watch change to update render
  const messageElements = van.derive(()=>div(messages.val.map(m => Message(m))))

  // Create the window element
  const windowEl = div({class: "window"},
    div({class: "titlebar"},
      div({class: "title"}, "Black Chat — Public"),
      div({class: "titlebar-controls"},
        button("_"),
        button("□"),
        button({class: "close"}, "×"),
      )
    ),

    div({id:"messages",class: "chat-messages"},
      messageElements
    ),

    div({class: "input-area"},
      textarea({
        class: "message-input",
        value: messageInput,
        oninput: e => messageInput.val = e.target.value,
        onkeydown: onKeyDown,
        placeholder: "Type a message…",
        rows: "1",
        autofocus: true,
      }),
      button({class: "send-btn", onclick: sendMessage}, "Send")
    )
  );

  // Make it draggable
  windowEl.addEventListener("mousedown", (e) => {
    if (!e.target.closest(".titlebar")) return;
    if (e.target.closest("button")) return;

    const win = e.currentTarget;
    let shiftX = e.clientX - win.getBoundingClientRect().left;
    let shiftY = e.clientY - win.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      win.style.left = pageX - shiftX + "px";
      win.style.top  = pageY - shiftY + "px";
    }

    function onMouseMove(e) {
      moveAt(e.clientX, e.clientY);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", onMouseMove);
    }, {once: true});
  });

  setUpConnChat();

  return windowEl;
}
//-----------------------------------------------
// 
//-----------------------------------------------
function App() {
  return div(
    {
      style: `
        display: flex;
        height: 100vh;
        width: 100vw;
        margin: 0;
        overflow: hidden;
        background: #0d1117;
        color: #e6edf3;
        font-family: system-ui, sans-serif;
      `
    },

    // First (narrow) sidebar – 32px
    div(
      {
        style: `
          width: 32px;
          flex: 0 0 32px;
          background: #161b22;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 8px;
          box-sizing: border-box;
          font-size: 20px;
          gap: 24px;
        `
      },
      "≡",  // or home icon, menu icon, etc.
      "★",
      "⚙",
      "⏻"
    ),

    // Second sidebar – next to the narrow one
    div(
      {
        style: `
          width: 240px;
          flex: 0 0 240px;
          background: #0f1620;
          border-right: 1px solid #30363d;
          padding: 16px;
          box-sizing: border-box;
          overflow-y: auto;
        `
      },
      div({style:"font-weight:bold; margin-bottom:16px;"}, "Second Sidebar"),
      "Projects",
      div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      "Team",
      div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      "Messages",
      div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      "Settings"
    ),

    // Main content – takes everything that's left
    div(
      {
        style: `
          flex: 1;
          background: #0d1117;
          padding: 24px;
          overflow-y: auto;
          box-sizing: border-box;
        `
      },
      div({style:"font-size:1.4em; margin-bottom:1em;"}, "Main Content Area"),
      "This area now uses the full remaining width →",
      "\n\nEverything to the right of the two sidebars belongs here."
    )
  );
}
//-----------------------------------------------
// 
//-----------------------------------------------
function UserPanel() {
  // You would normally pull these from state / props / WebRTC / server
  // const username = "Guest";           // ← replace with real data
  const avatarUrl = "";  // ← real avatar
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

  return div(
    {
      style: `
        position: fixed;
        bottom: 8px;
        left: 8px;
        width: 280px;
        height: 60px;
        background: #2f3136;          /* Discord dark gray */
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.4);
        color: #dcddde;
        font-family: 'gg sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        user-select: none;
        z-index: 9999;
      `
    },

    // Avatar + name section (left)
    div(
      { style: "display:flex; align-items:center; gap:10px; flex:1;" },
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
        label({onclick:()=>editName(),style: "font-weight:600;" }, userName),
        // label({onclick:()=>editStatus(), style: "font-size:12px; color:#b9bbbe;" }, "idle msg")
        label({onclick:()=>editStatus(), style: "font-size:12px; color:#b9bbbe;" }, userStatus)
      )
    ),

    // Controls (right) - mic, headset, settings
    div(
      { style: "display:flex; gap:12px;" },
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
//-----------------------------------------------
// 
//-----------------------------------------------




//-----------------------------------------------
// 
//-----------------------------------------------
van.add(document.body, App());
const chatWindowEl = ChatWindow();
van.add(document.body, chatWindowEl);
// makeDraggable(chatWindowEl);
van.add(document.body, UserPanel());


// Modal
// const closed = van.state(false)
// van.add(document.body, Modal({closed},
//   p("Hello, World!"),
//   div({style: "display: flex; justify-content: center;"},
//     button({onclick: () => closed.val = true}, "Ok"),
//   ),
// ))

function editUserNamePanel(){

  const closed = van.state(false)
  const editUserName = van.state("");
  function applyEditName(){

  }
  return Modal({closed},
    p("Change user name!"),
    div({style: "display: flex; justify-content: center;"},
      input({value:editUserName,oninput:e=>editUserName.val=e.target.value}),
      button({onclick: () => closed.val = true}, " Okay "),
      button({onclick: () => closed.val = true}, "Cancel"),
    ),
  )
}


function editStatusPanel(){

  const closed = van.state(false)
  const editUserName = van.state("");
  function applyEditName(){

  }
  return Modal({closed},
    p("Edit status!"),
    div({style: "display: flex; justify-content: center;"},
      input({value:editUserName,oninput:e=>editUserName.val=e.target.value}),
      button({onclick: () => closed.val = true}, " Okay "),
      button({onclick: () => closed.val = true}, "Cancel"),
    ),
  )
}

// van.add(document.body, editStatusPanel());

function editAvatarImagePanel(){

  const closed = van.state(false)
  const el_file = input({type:'file'})

  async function upload_file(event){
    console.log(event);
    const file = el_file.files[0];
    console.log(file);
    console.log(file.type);

    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);

    console.log(arrayBuffer);
    try {
      conn.reducers.uploadAvatar({
        userId:BigInt(1),
        mimeType:file.type,
        data:fileBytes
      });  
      console.log("pass!");
      closed.val = true;
    } catch (error) {
      
    }
  }

  return Modal({closed},
    p("Edit status!"),
    div({style: "display: flex; justify-content: center;"},
      el_file,
      button({onclick:upload_file}, "Upload File"),
      button({onclick: () => closed.val = true}, "Cancel"),
    ),
  )
}

// van.add(document.body, editAvatarImagePanel());