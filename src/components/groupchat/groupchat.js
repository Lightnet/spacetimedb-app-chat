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

  return Modal({closed, },
    p({style:`background-color:black;`},"Name the Group Chat:"),
    div({style: "display: flex; justify-content: center;background-color:black;"},
       label('Group Name: '), input({value:groupName.val, oninput:e=>groupName.val=e.target.value}),
      button({onclick:create_group}, "Create"),
      button({onclick: () => closed.val = true}, "Cancel"),
    ),
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