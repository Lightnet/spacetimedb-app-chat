// 
// 
// 

import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.6.0.min.js";
const { div, textarea, button, span, img, label } = van.tags;

const Message = ({side, name, text}) => div(
  {class: () => `message ${side}`},
  name && span({class: "name"}, name),
  text
);

function ChatWindow() {
  const messageInput = van.state("");

  const messages = van.state([
    { side: "received", name: "Steam", text: "Welcome to the black edition chatroom." },
    { side: "sent",     name: "You",   text: "yo, any drops today?" },
    { side: "received", name: "Steam", text: "Soon™" },
  ]);

  function sendMessage() {
    const text = messageInput.val.trim();
    if (!text) return;

    messages.val = [...messages.val, { side: "sent", name: "You", text }];
    messageInput.val = "";

    // Fake reply
    setTimeout(() => {
      const replies = ["Waiting...", "Soon™", "Check your inventory", "Working on it", "Nice", "..."];
      messages.val = [
        ...messages.val,
        { side: "received", name: "Steam", text: replies[Math.floor(Math.random() * replies.length)] }
      ];
    }, 600 + Math.random() * 1400);
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

  return div({class: "window"},
    div({class: "titlebar"},
      div({class: "title"}, "Black Chat — Friends"),
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
}

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



van.add(document.body, App());
van.add(document.body, ChatWindow());

// function DisplayUserPanel(){
//   return div({style:`position:fixed; bottom:2px; left:2px; width:260px;height:48px;background-color:gray;`},
//     div(
//       img({width:'32',height:'32'}),
//       label('test'),
//     ),
//     div(
//       label('mic'),
//       label('input settings')
//     ),
//     div(
//       label('headset'),
//       label('output settings')
//     ),
//     div(
//       label('settings')
//     )
//   )
// }

// van.add(document.body, DisplayUserPanel());



function UserPanel() {
  // You would normally pull these from state / props / WebRTC / server
  const username = "Guest";           // ← replace with real data
  const avatarUrl = "";  // ← real avatar
  const isMuted   = van.state(false);
  const isDeafened = van.state(false);

  function toggle_mic(){
    isMuted.val = !isMuted.val
    console.log(isMuted.val);
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
        src: avatarUrl,
        width: "40",
        height: "40",
        style: "border-radius:50%; object-fit:cover;"
      }),
      div(
        { style: "display:flex; flex-direction:column;" },
        label({ style: "font-weight:600;" }, username),
        label({ style: "font-size:12px; color:#b9bbbe;" }, "idle msg")
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

van.add(document.body, UserPanel());