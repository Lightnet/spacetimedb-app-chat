// 

import { dbGroupChats, stateConn } from "../../context";
import { groupChatWindow } from "./window_groupchat";
import van from "vanjs-core";
import { Modal } from "vanjs-ui";

const { div, input, textarea, button, span, img, label, p } = van.tags;

export function groupChatCreate(){
  const closed = van.state(false);
  const groupName = van.state('');

  function create_group(){
    console.log("create : ", groupName.val);
    const conn = stateConn.val;
    conn.reducers.createGroupChat({
      name:groupName.val,
      content:"None"
    });
  }

  return Modal({closed},
    div({style: `
      display: flex; 
      flex-direction: column; 
      gap: 1.5rem; 
      padding: 24px; 
      background-color: #1a1a1a; 
      color: #fff; 
      border-radius: 12px;
      min-width: 320px;
      font-family: sans-serif;
    `},
      // Header
      p({style: `margin: 0; font-size: 1.2rem; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 10px;`}, 
        "Create Group Chat"
      ),

      // Field Container
      div({style: `display: flex; flex-direction: column; gap: 8px;`},
        label({style: `font-size: 0.9rem; color: #bbb;`}, "Group Name"),
        input({
          value: groupName, 
          oninput: e => groupName.val = e.target.value,
          placeholder: "Enter group name...",
          style: `
            padding: 12px; 
            background: #2a2a2a; 
            color: white; 
            border: 1px solid #444; 
            border-radius: 6px;
            outline: none;
          `
        })
      ),

      // Centered Action Buttons
      div({style: `display: flex; justify-content: center; gap: 12px;`},
        button({
          onclick: create_group,
          style: `
            padding: 10px 24px; 
            background: #007bff; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer;
            font-weight: bold;
            flex: 1;
          `
        }, "Create"),
        
        button({
          onclick: () => closed.val = true,
          style: `
            padding: 10px 24px; 
            background: transparent; 
            color: #888; 
            border: 1px solid #444; 
            border-radius: 6px; 
            cursor: pointer;
            flex: 1;
          `
        }, "Cancel")
      )
    )
  )
}

export function groupChatPanel(id){
  const closed = van.state(false);
  const groupChatId = van.state(id);
  const message = van.state('');

  function send_msg(){
    console.log(groupChatId.val);
    const conn = stateConn.val;
    conn.reducers.sendGroupChatMessage({
      id:id,
      content:message.val
    });
  }

  return Modal({closed, id:id },
    p({style:`background-color:black;`},"Name the Group Chat:"),
    div({style: "display: flex; justify-content: center;background-color:black;"},
       label('Message: '), input({value:message.val, oninput:e=>message.val=e.target.value}),
      button({onclick:send_msg}, "Send"),
      button({onclick: () => closed.val = true}, "Cancel"),
    ),
  )
}

export function setupChatPanel(id, name){
  // groupChatPanel
  van.add(document.body, groupChatWindow(id, name));
}

function delete_group_chat_id(id){
  const conn = stateConn.val;
  conn.reducers.deleteGroupChat({
    id:id
  })
}

export function groupChatList(){

  const groups = van.derive(()=>{
    const chats = Array.from(dbGroupChats.val.values());
    // console.log(chats);
    return div(
      chats.map(group => div({id:'group-chat-'+group.id},
        label("[ "+group.name+" ]"),
        button({onclick:()=>setupChatPanel(group.id, group.name)},'[ Join ]'),
        span(' '),
        button({onclick:()=>delete_group_chat_id(group.id)},'[ Delete ]')
      ))
    );
  });

  return groups;

}