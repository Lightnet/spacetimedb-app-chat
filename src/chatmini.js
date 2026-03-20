// test chat mini
// need to refine steam old classic
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.6.0.min.js";

const { div, textarea, button, span, style, input } = van.tags;

const css = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #0e0e0e;
    font-family: "Segoe UI", "Tahoma", Arial, sans-serif;
    color: #d1d5db;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .window {
    width: 440px;
    height: 600px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    // box-shadow: 0 0 40px rgba(0,0,0,0.7);
  }

  .titlebar {
    height: 34px;
    background: linear-gradient(to bottom, #2a2a2a, #1f1f1f);
    border-bottom: 1px solid #111;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    user-select: none;
  }

  .title {
    color: #c5c5c5;
    font-size: 13px;
    font-weight: 500;
    text-shadow: 0 1px 1px #000;
  }

  .titlebar-controls button {
    width: 46px;
    height: 28px;
    background: transparent;
    border: none;
    color: #aaa;
    font-size: 16px;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
    border-radius: 3px;
  }

  .titlebar-controls button:hover {
    background: #3a3a3a;
    color: #eee;
  }

  .titlebar-controls button.close:hover {
    background: #e81123;
    color: white;
  }

  .chat-messages {
    flex: 1;
    padding: 12px 10px;
    overflow-y: auto;
    background: #111;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .message {
    max-width: 82%;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 13.5px;
    line-height: 1.38;
    word-wrap: break-word;
  }

  .message.sent {
    align-self: flex-end;
    background: #2d6da4;
    color: white;
    border-bottom-right-radius: 1px;
  }

  .message.received {
    align-self: flex-start;
    background: #2b2b2b;
    color: #e0e0e0;
    border-bottom-left-radius: 1px;
  }

  .message .name {
    display: block;
    font-size: 11.5px;
    opacity: 0.7;
    margin-bottom: 3px;
    font-weight: 500;
  }

  .input-area {
    height: 54px;
    background: #1e1e1e;
    border-top: 1px solid #222;
    padding: 8px 10px;
    display: flex;
    gap: 8px;
  }

  .message-input {
    flex: 1;
    background: #252525;
    color: #e0e0e0;
    border: 1px solid #333;
    border-radius: 3px;
    padding: 8px 10px;
    font-size: 13.5px;
    resize: none;
    font-family: inherit;
    line-height: 1.4;
  }

  .message-input:focus {
    outline: none;
    border-color: #4779b7;
    box-shadow: 0 0 0 1px #4779b7;
  }

  button.send-btn {
    width: 70px;
    background: #2d6da4;
    color: white;
    border: none;
    border-radius: 3px;
    font-size: 13px;
    cursor: pointer;
  }

  button.send-btn:hover {
    background: #3a80c2;
  }

  button.send-btn:active {
    background: #1f5a8f;
  }

  /* Scrollbar styling — old-school dark */
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: #0f0f0f;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }

  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
`;

van.add(document.head, style(css));

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

van.add(document.body, ChatWindow());