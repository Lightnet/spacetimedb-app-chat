// chat ui test build
// 
// 
import { DbConnection, tables } from './module_bindings';
import van from "vanjs-core";
import { networkStatus, userIdentity, userName, userStatus, userAvatarUrl, stateConn, userId } from './context.js';
import { Modal } from "vanjs-ui";
import { setUpDBUser } from './db/db_user.js';
import { setupDataBaseAvatar } from './db/db_image.js';
import { STDBPanel } from './components/spacetimedb/stdboanel.js';
import { ChatWindow } from './components/chat/window_chat.js';
import { editUserNamePanel, UserPanel } from './components/user/user.js';
import { groupChatCreate, groupChatList } from './components/groupchat/groupchat.js';
import { setupDBGroupChat } from './db/db_groupchat.js';
import { setupDBContact } from './db/db_contact.js';
import { contactAdd, contactList } from './components/contact/contact.js';

const { div, input, textarea, button, span, img, label, p } = van.tags;

const HOST = 'ws://localhost:3000';
const DB_NAME = 'spacetime-app-chat';
const TOKEN_KEY = `${HOST}/${DB_NAME}/auth_token`;
// localStorage.getItem('auth_token')
//-----------------------------------------------
//
//-----------------------------------------------

// const el_status = van.state('Offline');
// const username = van.state('Guest');

const groupChatEl = div();
const contactEl = div();

//-----------------------------------------------
//
//-----------------------------------------------
const conn = DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  // .withToken(localStorage.getItem('auth_token') || undefined)
  .withToken(localStorage.getItem(TOKEN_KEY) || undefined)
  .onConnect((conn, identity, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    networkStatus.val = 'Connected';
    stateConn.val = conn;
    // console.log("identity: ", identity);
    console.log("identity: ", identity.toHexString());
    // console.log("conn: ", conn);
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

//-----------------------------------------------
// 
//-----------------------------------------------
function initDB(){
  setUpDBUser();
  setupDataBaseAvatar();
  setupDBGroupChat();
  setupDBContact();
  // test_db();
}

//-----------------------------------------------
// CONTACT
//-----------------------------------------------
// function delete_contact_id(id){

// }

// function update_contact(row){
//   const groupChatElId = document.getElementById('contact-'+row.id);
//   if(groupChatElId){
//     groupChatElId.remove();
//   }
//   van.add(groupChatEl, div({id:'contact-'+row.id},
//     label(" [ ID:"+ row.userId + " ] "),
//     span(' '),
//     button({onclick:()=>delete_contact_id(row.id)},'[ Delete ]')
//   ))
// }



//-----------------------------------------------
// MESSAGE
//-----------------------------------------------
const Message = ({side, name, text}) => div(
  {class: () => `message ${side}`},
  name && span({class: "name"}, name),
  text
);
//-----------------------------------------------
// PUBLIC CHAT WINDOW
//-----------------------------------------------

function onTest(){
  console.log("test");
  // conn.reducers.testC({});
  // conn.reducers.testId()
  // conn.reducers.testRandom()
  conn.reducers.testSalt()
}

// function contactAdd(){
//   const closed = van.state(false);
//   const contactId = van.state('');

//   function create_group(){
//     console.log("create : ", contactId.val);
//     conn.reducers.addContact({
//       id:contactId.val
//     })
//   }

//   return Modal({closed, },
//     p({style:`background-color:black;`},"Add Contact:"),
//     div({style: "display: flex; justify-content: center;background-color:black;"},
//       label('Name: '), input({value:contactId.val, oninput:e=>contactId.val=e.target.value}),
//       button({onclick:create_group}, "Create"),
//       button({onclick: () => closed.val = true}, "Cancel"),
//     ),
//   )

// }

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
      // div("test"),
      // groupChatEl,
      groupChatList(),
      div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      button({},"Contact"),button({onclick:()=>{
        van.add(document.body, contactAdd());
      }},"+"),
      // contactEl,
      contactList(),
      div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      button({onclick:onTest},'Test'),
      // div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      // button("Friend(s)"),
      // button("+"), 
      // button("-"),

      // div({style:"font-weight:bold; margin-bottom:16px;"}, "Second Sidebar"),
      // "Projects",
      // div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      // "Team",
      // div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      // "Messages",
      // div({style:"height:1px; background:#30363d; margin:12px 0;"}),
      // "Settings"
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
// Add Body
//-----------------------------------------------
van.add(document.body, App());
// const chatWindowEl = ChatWindow();
// van.add(document.body, chatWindowEl);
// makeDraggable(chatWindowEl);
van.add(document.body, UserPanel());
van.add(document.body, STDBPanel());

// van.add(document.body, editAvatarImagePanel());

// conn.subscriptionBuilder().subscribe(
//  tables.user.where(r => r.online.eq(true))
// );

// https://spacetimedb.com/docs/clients/typescript/
// tables.groupMessage.groupId
// console.log(tables.groupMessage);
// console.log(tables.groupMessage.where(r=>r.groupId.eq(id)))
