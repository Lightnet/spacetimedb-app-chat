// 

import { networkStatus, stateConn, userIdentity } from "../../context";
import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import { tables } from "../../module_bindings";

const { div, input, textarea, button, span, img, label, p, table } = van.tags;

//-----------------------------------------------
// MESSAGE
//-----------------------------------------------
const Message = ({side, name, text}) => div(
  {class: () => `message ${side}`},
  name && span({class: "name"}, name),
  text
);

export function ChatWindow() {
  const closed = van.state(false);
  const messageInput = van.state("");
  const closeMesage = van.state(false);
  const messages = van.state([
    // { side: "received", name: "Steam", text: "Welcome to the black edition chatroom." },
    // { side: "sent",     name: "You",   text: "yo, any drops today?" },
    // { side: "received", name: "Steam", text: "Soon™" },
  ]);
  let messageSub = null;
  // let connMessage = null;


  function sendMessage() {
    const text = messageInput.val.trim();
    if (!text) return;
    // messages.val = [...messages.val, { side: "sent", name: "You", text }];
    messageInput.val = "";
    const conn = stateConn.val;
    conn.reducers.sendMessage({
      text:text
    });
  }

  function update_message(ctx, row){
    if(closeMesage.val == true){
      console.log("close chat...");
      return;
    }
    let side = '';
    console.log(row)
    // if(row.userId.toHexString() == userIdentity.val.toHexString()){
    if(row.userId == userIdentity.val.toHexString()){
      // console.log("FOUND USER???");
      side = "sent";
    }
    messages.val = [...messages.val, { side: side, name: "You", text:row.content }];
  }

// https://spacetimedb.com/docs/clients/subscriptions/
  function setUpConnChat(){
    //create subscription
    const conn = stateConn.val;
    messageSub = conn
      .subscriptionBuilder()
      .onApplied((ctx)=>{
        // connMessage = ctx;
        ctx.db.messages.onInsert(update_message);
      })
      .onError((ctx, error) => {
        console.error(`Subscription failed: ${error}`);
      })
      .subscribe(tables.messages);
    console.log(messageSub);
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

  // need to clean up differently.
  van.derive(()=>{
    console.log("group chat closed: ", closed.val);
    if(closed.val == true){
      console.log(messageSub);
      if(messageSub != null){
        if(messageSub.isActive){
          // remove callback function
          const conn = stateConn.val;
          conn.db.messages.removeOnInsert(update_message);
          // subscription remove table listen
          messageSub.unsubscribe();
        }
      }
    }
  })

  // watch change to update render
  const messageElements = van.derive(()=>div(messages.val.map(m => Message(m))))

  // Create the window element
  const windowEl = div({class: "window"},
    div({class: "titlebar"},
      div({class: "title"}, "Black Chat — Public"),
      div({class: "titlebar-controls"},
        button("_"),
        button("□"),
        button({onclick:()=>closed.val=true,class: "close"}, "×"),
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
  return ()=> closed.val ? null : windowEl;
}
