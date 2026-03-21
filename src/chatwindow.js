// chat window

import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.6.0.min.js";
const { div, textarea, button, span } = van.tags;


// Add this function somewhere in your file (e.g. before return)
function makeDraggable(element) {
  let pos = { x: 0, y: 0, startX: 0, startY: 0 };

  const onMouseMove = (e) => {
    if (!pos.active) return;
    
    e.preventDefault();
    
    // Calculate new position
    pos.x = pos.startX + (e.clientX - pos.startMouseX);
    pos.y = pos.startY + (e.clientY - pos.startMouseY);

    // Apply position
    element.style.left = pos.x + "px";
    element.style.top  = pos.y + "px";
  };

  const onMouseUp = () => {
    pos.active = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup",   onMouseUp);
  };

  element.addEventListener("mousedown", (e) => {
    // Only drag when clicking on titlebar (not on buttons)
    if (e.target.closest(".titlebar-controls")) return;

    e.preventDefault();
    
    pos.active = true;
    pos.startMouseX = e.clientX;
    pos.startMouseY = e.clientY;
    
    // Current position of window
    const rect = element.getBoundingClientRect();
    pos.startX = rect.left;
    pos.startY = rect.top;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup",   onMouseUp);
  });
}


const Message = ({side, name, text}) => div(
  {class: () => `message ${side}`},
  name && span({class: "name"}, name),
  text
);




export function ChatWindow() {
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

  // Create the window element
  const windowEl = div({class: "window"},
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

  // Make it draggable
  van.derive(() => {
    // Wait until mounted
    if (windowEl.isConnected) {
      makeDraggable(windowEl);
    }
  });

  return windowEl;

}