import { dbDirectConversations, stateConn, userId } from "../../context";
import { tables } from "../../module_bindings";
import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import { debounce } from "../helpers/debounce";
import { onDetach } from "../helpers/ondetach";

const { div, input, textarea, button, span, img, label, p } = van.tags;

function directMessageId(id,conId){
  const conn = stateConn.val;
  conn.reducers.markConversationAsRead({id:conId});// mark as read when open.
  const container = document.getElementById(id);
  if(!container){
    van.add(document.body, modalDirectMessage(id));
  }
  
}

export function DirectConversationsList(){
  function renderUnread(item){
    if(item.userA == userId.val ){
      if(item.unreadCountA > 0){
        return label('('+ String(item.unreadCountA) + ')')
      }
    }
    if(item.userB == userId.val ){
      if(item.unreadCountB > 0){
        return label('('+ String(item.unreadCountB) + ')')
      }
    }
    return span()
  }

  function fromUser(item){
    if(item.userB != userId.val){
      return label({onclick: () => directMessageId(item.userB,item.id)},"["+item.userB.substring(0,20)+"]")
    }else{
      
    }
    if(item.userA != userId.val){
      return label({onclick: () => directMessageId(item.userA,item.id)},"["+item.userA.substring(0,20)+"]");
    }
  }

  const groups = van.derive(()=>{
    const chats = Array.from(dbDirectConversations.val.values());
    // console.log(chats);
    return div(
      chats.map(group => div({id:'group-chat-'+group.id},
        // label("["+group.userB.substring(0,20)+"]"),
        fromUser(group),

        // button({onclick:()=>setupChatPanel(group.id, group.name)},'[ Join ]'),
        // span(' [Mgs] '),
        renderUnread(group),
        // button({onclick:()=>delete_group_chat_id(group.id)},'[ Delete ]')
      ))
    );
  });

  return groups;

}

//-----------------------------------------------
// MESSAGE
//-----------------------------------------------
const Message = ({side, name, text}) => div(
  {class: () => `message ${side}`},
  name && span({class: "name"}, name),
  text
);

export function modalDirectMessage(senderId){
  const closed = van.state(false);
  const directMessageId = van.state(senderId);
  const messageInput = van.state("");
  const messages = van.state([]);

  const stateTitle = van.state("");
  let directMessageSub = null;

  const conn = stateConn.val;
  van.derive( async ()=>{
    let userName = await conn.procedures.getUserNameId({
      id:senderId
    })//.substring(0,16)
    console.log(userName);
    if(userName){
      stateTitle.val = userName.substring(0,20);
    }
  })
  
  function sendMessage() {
    const text = messageInput.val.trim();
    if (!text) return;
    messageInput.val = "";
    const conn = stateConn.val;
    conn.reducers.sendDirectMessage({
      id:senderId,
      text:text
    });
  }

  function update_messages(ctx, row){
    let side = '';
    // console.log("group msg...");
    // console.log(row);
    if(row.recipientId == userId.val){
      // console.log("FOUND USER???");
      side = "sent";
    }
    messages.val = [...messages.val, { side: side, name: "You", text:row.content }];
    scrollMessages();
  }

  function setUpConnChat(){
    //create subscription to unsubscribe.
    const conn = stateConn.val;

    directMessageSub = conn
      .subscriptionBuilder()
      .onApplied((ctx)=>{
        ctx.db.my_direct_messages.onInsert(update_messages);
      })
      .onError((ctx, error) => {
        console.error(`Subscription failed: ${error}`);
      })
      .subscribe(tables.my_direct_messages.where(r => 
        (r.recipientId.eq(senderId).and(r.senderId.eq(userId.val))) // Scenario A: User sent to Friend
        .or
        (r.senderId.eq(senderId).and(r.recipientId.eq(userId.val))) // Scenario B: Friend sent to User
      )); 
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function updateMessageScroll(){
    const container = document.getElementById(senderId);
    if (container) {
      //container.scrollTop = container.scrollHeight
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
  const scrollMessages = debounce(updateMessageScroll, 100);

  function cleanUp(){
    console.log("clean up...");
    if(directMessageSub.isActive){
      // since it view it need main connector client
      const conn = stateConn.val;
      conn.db.my_direct_messages.removeOnInsert(update_messages)
      directMessageSub.unsubscribe();
    }
  }

  const messageElements = van.derive(()=>div(messages.val.map(m => Message(m))))

  const windowEl = div({class: "window"},
    onDetach(cleanUp),
    div({class: "titlebar"},
      div({class: "title"}, label(stateTitle),label(" - Direct Message")),
      div({class: "titlebar-controls"},
        button("_"),
        button("□"),
        button({onclick:()=>closed.val=true ,class: "close"}, "×"),
      )
    ),

    div({id:senderId,class: "chat-messages"},
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