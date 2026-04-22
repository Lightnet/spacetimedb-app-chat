
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

//-----------------------------------------------
// WINDOW GROUP CHAT
//-----------------------------------------------
export function groupChatWindow(groupId, name){
  const closed = van.state(false);
  const groupChatName = van.state(name);
  const messageInput = van.state("");
  const messages = van.state([]);
  let groupMsgSub = null;

  function sendMessage() {
    const text = messageInput.val.trim();
    if (!text) return;
    // messages.val = [...messages.val, { side: "sent", name: "You", text }];
    messageInput.val = "";
    // conn.reducers.sendMessage({
    //   text:text
    // });
    console.log("groupId: ", groupId);
    const conn = stateConn.val;
    conn.reducers.sendGroupChatMessage({
      id:groupId,
      content:text
    });
  }

  function update_messages(ctx, row){
    let side = '';
    console.log("group msg...");
    if(row.senderId.toHexString() == userIdentity.val.toHexString()){
      // console.log("FOUND USER???");
      side = "sent";
    }
    messages.val = [...messages.val, { side: side, name: "You", text:row.content }];
  }

  function setUpConnChat(){
    //create subscription to unsubscribe.
    const conn = stateConn.val;
    conn.reducers.setGroupChatId({id:groupId});

    groupMsgSub = conn
      .subscriptionBuilder()
      .onApplied((ctx)=>{
        // ctx.db.groupChatMessage.onInsert((ctx, row)=>{
        ctx.db.current_group_chat_messages.onInsert(update_messages);
      })
      .onError((ctx, error) => {
        console.error(`Subscription failed: ${error}`);
      })
      // .subscribe(tables.groupChatMessage.where(r=>r.groupId.eq(groupId)));
      .subscribe(tables.current_group_chat_messages);
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
      const container = document.getElementById(groupId);
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },50);
  });
  // This will handle the table to unsubscribe. To stop listen table.
  // TODO
  // clean here HERE
  van.derive(()=>{
    console.log("group chat closed: ", closed.val);
    if(closed.val == true){
      console.log(groupMsgSub);
      if(groupMsgSub.isActive){
        // since it view it need main connector client
        const conn = stateConn.val;
        conn.db.current_group_chat_messages.removeOnInsert(update_messages)
        groupMsgSub.unsubscribe();
      }
    }
  })

  // watch change to update render
  const messageElements = van.derive(()=>div(messages.val.map(m => Message(m))))

  // Create the window element
  const windowEl = div({class: "window"},
    div({class: "titlebar"},
      div({class: "title"}, `${groupChatName.val} - Group Chat`),
      div({class: "titlebar-controls"},
        button("_"),
        button("□"),
        button({onclick:()=>closed.val=true ,class: "close"}, "×"),
      )
    ),

    div({id:groupId,class: "chat-messages"},
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
