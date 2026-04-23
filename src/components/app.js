
import { DbConnection, tables } from '../module_bindings';
import { networkStatus, stateConn } from '../context.js';
import { STDBPanel } from './spacetimedb/stdboanel.js';
import { ChatWindow } from './chat/window_chat.js';
import { groupChatCreate, groupChatList } from './groupchat/groupchat.js';
import { contactAdd, contactList } from './contact/contact.js';
import van from "vanjs-core";
import { DirectConversationsList } from './directmessage/directmessage.js';
// import { Modal } from "vanjs-ui";

const { div, input, textarea, button, span, img, label, p } = van.tags;


//-----------------------------------------------
// 
//-----------------------------------------------
function onTest(){
  const conn = stateConn.val;
  console.log("test");
  // conn.reducers.testC({});
  // conn.reducers.testId()
  // conn.reducers.testRandom()
  conn.reducers.testSalt()
}
//-----------------------------------------------
// 
//-----------------------------------------------
export function App() {

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
      // button("≡"),  // or home icon, menu icon, etc.
      // button("★"),
      // button("⚙"),
      // button("⏻")
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
      div({style:"font-weight:bold; margin-bottom:16px;"}, "Hub"),
      div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      button({onclick:()=>{
        van.add(document.body, ChatWindow());
      }},"Public Chat"),
      // div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      // button("Community"),button("+"), 
      div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      button({},"Group Chat"),button({onclick:()=>{
        van.add(document.body, groupChatCreate());
      }},"+"),
      groupChatList(),
      div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      button({},"Contacts"),button({onclick:()=>{
        van.add(document.body, contactAdd());
      }},"+"),
      contactList(),
      div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      label("Messages"),

      DirectConversationsList(),
      // div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      // "Settings"
      // div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      // button({onclick:onTest},'Test'),
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